import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { SubscriptionDTO, RazorpaySubscriptionPaymentData, Prime, SubscriptionUseCaseResponse, PaymentOrderDTO, PaymentDTO} from "../dtos/SubscriptionDTO";
import { UserDTO } from "../dtos/UserDTO";
import { IRazorpay } from "../interfaces/IRazorpay";
import { ISalesRepository } from "../../domain/repositories/ISalesRepository";
import { SearchFilterSortParams, tempUserStore } from "../dtos/CommonDTO";
import { paramToQuerySubscription } from "../../interfaces/utils/paramToQuery";
import { toTransaction } from "../../infrastructure/mappers/walletDataMapper";
import { ISubscriptionUseCase } from "../interfaces/common/ISubscriptionUseCase";
import { toUserDTO } from "../../interfaces/mappers/userDTOMapper";
import { toSubscriptionDTO, toSubscriptionDTOs } from "../../interfaces/mappers/subscriptionDTOMapper";

export enum SaleType {
    SUBSCRIPTION = 'subscription',
    EVENT = 'event'
 };

const paymentInProgress: { [key: string]: boolean } = {};

export class SubscriptionManagement implements ISubscriptionUseCase {
    constructor(
        private _subscriptionRepository: ISubscriptionRepository,
        private _razorpay: IRazorpay,
        private _userRepository: IUserRepository,
        private _walletRepository: IWalletRepository,
        private _salesRepository: ISalesRepository
    ) { };


    private async _fetchAndEnrich(query?: SearchFilterSortParams): Promise<SubscriptionUseCaseResponse> {
        try {

            if(query){
                const queryResult = await paramToQuerySubscription(query);
                const total = await this._subscriptionRepository.countDocs(queryResult.query);
                const subscriptions = await this._subscriptionRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );

                return { subscription: toSubscriptionDTOs(subscriptions)  ?? [], total: total ?? 0 }
            };
            const total = await this._subscriptionRepository.countDocs({});
            const subscriptions = await this._subscriptionRepository.findAll();
            return { subscription: toSubscriptionDTOs(subscriptions) ?? [], total: total ?? 0 };  
        } catch (error) {
            throw new Error('Something happend fetchAndEnrich')
        };
    };

    private async _setPrimeData(planType: string, userId: string, billedAmount: number): Promise<Prime> {
        try {
            const startDate = new Date();
            let endDate: Date | null = null;

            if (planType === "monthly") {
                endDate = new Date();
                endDate.setMonth(startDate.getMonth() + 1); 
            } else if (planType === "yearly") {
                endDate = new Date();
                endDate.setFullYear(startDate.getFullYear() + 1);
            } else if (planType === "weekly") {
                endDate = new Date();
                endDate.setDate(startDate.getDate() + 7);
            };

            const primeData = {
                id: userId,
                planType: planType,
                startDate: startDate,
                endDate: endDate,
                billedAmount,
            };

            return primeData;
        } catch (error) {
            throw new Error('something happend in setPrimeData')
        };
    };

    private async _cashBack(userId: string, amount: number): Promise<number | void> {
        try {
            const userDetails = await this._userRepository.findById(userId);
            let cashBackPercentage = 0;

            if (userDetails?.prime) {
                cashBackPercentage = userDetails.prime.primeCount === 1 ? 10 : 0;
            };

            if (cashBackPercentage) {
                const cashBack = parseFloat(((amount * cashBackPercentage) / 100).toFixed(2));
                const walletData = toTransaction({amount: cashBack, description:'10% cash back', paymentType:'credit' })
                await this._walletRepository.updateTransaction(userId, walletData);
                return cashBack;
            };
            return 0;
        } catch (error) {
            throw new Error('something happend in cashBack');
        };
    };

    async fetchData(options?: SearchFilterSortParams): Promise<SubscriptionUseCaseResponse | null> {
        try {
            const subscriptions = await this._fetchAndEnrich(options);
            return subscriptions ?? null;
        } catch (error) {
            throw new Error('something happend in fetchData')
        };
    };

    async handleListing(subscriptionId: string, query: SearchFilterSortParams): Promise<SubscriptionUseCaseResponse| null> {
        try {
            const subscription = await this._subscriptionRepository.findById(subscriptionId);

            if (subscription) {
                const status = !subscription.isListed;
                const result = await this._subscriptionRepository.listById(subscriptionId, status);

                if (result) {
                    const subscriptions = await this._fetchAndEnrich(query);
                    return subscriptions;
                };
            };
            return null;
        } catch (error) {
            throw new Error('something happend in handleListing')
        };
    };

    async update(subscriptionId: string, field: string, value: string, query: SearchFilterSortParams): Promise<SubscriptionUseCaseResponse| null> {
        try {
            const updateData = { [field]: parseInt(value) };
            const subscription = await this._subscriptionRepository.update(subscriptionId, updateData);

            if (subscription) {
                const subscriptions = await this._fetchAndEnrich(query);
                return subscriptions;
            };
            return null;
        } catch (error) {
            throw new Error('something happend in update');
        };
    };

    async selectedPlan(subscriptionId: string): Promise<SubscriptionDTO | null> {
        try {
            const subscription = await this._subscriptionRepository.findById(subscriptionId);
            tempUserStore[subscriptionId] = subscription
            return subscription ? toSubscriptionDTO(subscription): null;

        } catch (error) {
            throw new Error('something happend in selectedPlan')
        };
    };

    async createOrder(paymentOrderData: PaymentOrderDTO): Promise<boolean | null | string > {
        const { amount, currency, userId, isPrime } = paymentOrderData;
        try {

            if (paymentInProgress[userId] || isPrime) {
                return null;
            };
            paymentInProgress[userId] = true;
            return await this._razorpay.createOrder(amount, currency);
        } catch (error) {
            throw new Error('something happend in createOrder')
        };
    };

    async abortPayment(userId: string): Promise<boolean> {
        try {
            if(paymentInProgress[userId]){
                paymentInProgress[userId] = false;
                return true;
            }
            return false;
        } catch (error) {
           throw new Error('something happend in abortPayment');
        };
    };

    async verifyPayment(razorpaySubscriptionPaymentData: RazorpaySubscriptionPaymentData): Promise<UserDTO | null> {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, 
                    userId, planType, amount, planId 
                  } = razorpaySubscriptionPaymentData;

            const isValid = await this._razorpay.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });
            if (!isValid) { return null }

            const primeData = await this._setPrimeData(planType, userId, (amount / 100));
            const user = await this._userRepository.updatePrimeById(userId, primeData );
            await this._salesRepository.create({
                userId,
                subscriptionId: planId,
                saleType: SaleType.SUBSCRIPTION,
                billedAmount: (amount / 100),
                planType,
            });

            await this._cashBack(userId, amount);
            paymentInProgress[userId] = false;

            if (!user) return null;
            
            return user ? toUserDTO(user): null;
        } catch (error) {
            throw new Error('something happend in  verifyPayment')
        };
    };

    async paymentUsingWallet(paymentData: PaymentDTO): Promise<UserDTO | null> {
        try {
            const { userId, planType, amount,planId  } = paymentData;

            const primeData = await this._setPrimeData(planType, userId, amount);
            const result = await this._userRepository.updatePrimeById(userId, primeData);
           
            await this._salesRepository.create({
                userId,
                subscriptionId: planId,
                saleType: SaleType.SUBSCRIPTION,
                billedAmount: amount ,
                planType,
            });

            await this._cashBack(userId, amount);

            if (!result) { return null }
            return result ? toUserDTO(result) : null;
        } catch (error) {
            throw new Error('something happend in   paymentUsingWallet');
        };
    };
};