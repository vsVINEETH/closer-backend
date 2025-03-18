import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import { SubscriptionDTO, RazorpaySubscriptionPaymentData, Prime} from "../dtos/SubscriptionDTO";
import { UserDTO } from "../dtos/UserDTO";
import { IRazorpay } from "../interfaces/IRazorpay";
import { ISalesRepository } from "../../domain/repositories/ISalesRepository";
import { ClientQuery} from "../../../types/express";
import { SearchFilterSortParams, tempUserStore } from "../dtos/CommonDTO";
import { paramToQuerySubscription } from "../../interfaces/utils/paramToQuery";
export enum SaleType {
    SUBSCRIPTION = 'subscription',
    EVENT = 'event'
 };

const paymentInProgress: { [key: string]: boolean } = {};

export class SubscriptionManagement {
    constructor(
        private subscriptionRepository: ISubscriptionRepository,
        private razorpay: IRazorpay,
        private userRepository: IUserRepository,
        private walletRepository: IWalletRepository,
        private salesRepository: ISalesRepository
    ) { }

    private async cashBack(userId: string, amount: number): Promise<number | void> {
        try {
            const userDetails = await this.userRepository.findById(userId);
            let cashBackPercentage = 0;

            if (userDetails?.prime) {
                cashBackPercentage = userDetails.prime.primeCount === 1 ? 10 : 0;
            }

            if (cashBackPercentage) {

                const cashBack = parseFloat(((amount * cashBackPercentage) / 100).toFixed(2));
                await this.walletRepository.addMoney(userId, cashBack, '10% cash back')
                return cashBack;
            }
            return
        } catch (error) {
            throw new Error('something happend in cashBack')
        }

    }

    private async setPrimeData(planType: string, userId: string, billedAmount: number): Promise<Prime> {
        try {
            const startDate = new Date();
            let endDate: Date | null = null;

            if (planType === "monthly") {
                endDate = new Date();
                endDate.setMonth(startDate.getMonth() + 1); // Add 1 month
            } else if (planType === "yearly") {
                endDate = new Date();
                endDate.setFullYear(startDate.getFullYear() + 1); // Add 1 year
            } else if (planType === "weekly") {
                endDate = new Date();
                endDate.setDate(startDate.getDate() + 7); // Add 7 days
            }

            const primeData = {
                id: userId,
                planType: planType,
                startDate: startDate,
                endDate: endDate,
                billedAmount,
                
            }
            return primeData
        } catch (error) {
            throw new Error('something happend in setPrimeData')
        }

    }

    async fetchData(options?: SearchFilterSortParams): Promise<{subscription: SubscriptionDTO[], total: number} | null> {
        try {

            let subscriptionData;
            if(options){
                const queryResult = await paramToQuerySubscription(options);

                subscriptionData = await this.subscriptionRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );
            } else {
             subscriptionData = await this.subscriptionRepository.findAll();
            }
            
            return subscriptionData ? {subscription: subscriptionData.subscription, total: subscriptionData.total} : null
        } catch (error) {
            throw new Error('something happend in fetchData')
        }

    }

    async handleListing(subscriptionId: string, query: SearchFilterSortParams): Promise<{subscription: SubscriptionDTO[], total: number}| null> {
        try {
            console.log('gooiing')
            const subscription = await this.subscriptionRepository.findById(subscriptionId);
            console.log(subscription)
            if (subscription) {
                const status = !subscription.isListed;
                const result = await this.subscriptionRepository.listById(subscriptionId, status);
                console.log('hellosffsfs')
                if (result) {
                    const queryResult = await paramToQuerySubscription(query);
                    const subscriptionData = await this.subscriptionRepository.findAll(
                        queryResult.query,
                        queryResult.sort,
                        queryResult.skip,
                        queryResult.limit
                    );
                    return subscriptionData ? {subscription: subscriptionData.subscription, total: subscriptionData.total} : null
                }
            }
            return null;
        } catch (error) {
            throw new Error('something happend in handleListing')
        }

    }

    async update(subscriptionId: string, field: string, value: string, query: SearchFilterSortParams): Promise<{subscription: SubscriptionDTO[], total: number}| null> {
        try {
            const subscription = await this.subscriptionRepository.updateById(subscriptionId, field, value);
            if (subscription) {
                const queryResult = await paramToQuerySubscription(query);
                const subscriptionData = await this.subscriptionRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );
                return subscriptionData ? {subscription: subscriptionData.subscription, total: subscriptionData.total} : null            }
            return null;
        } catch (error) {
            throw new Error('something happend in update')
        }

    };

    async selectedPlan(subscriptionId: string): Promise<SubscriptionDTO | null> {
        try {
            const data = await this.subscriptionRepository.findById(subscriptionId);
            tempUserStore[subscriptionId] = data
            return data;
        } catch (error) {
            throw new Error('something happend in selectedPlan')
        }

    }

    async createOrder(paymentOrderData: {amount: number, currency: string, userId: string, isPrime: boolean}): Promise<boolean | null | string > {
        const { amount, currency, userId, isPrime } = paymentOrderData;
        try {

            if (paymentInProgress[userId] || isPrime) {
                return null;
            };

            paymentInProgress[userId] = true;
            return await this.razorpay.createOrder(amount, currency);
       
        } catch (error) {
            throw new Error('something happend in createOrder')
        }
    }

    async abortPayment(userId: string): Promise<boolean> {
        try {
            if(paymentInProgress[userId]){
                paymentInProgress[userId] = false;
                return true
            }
            return false
        } catch (error) {
           throw new Error('something happend in abortPayment');
        }
    }

    async verifyPayment(razorpaySubscriptionPaymentData: RazorpaySubscriptionPaymentData): Promise<UserDTO | null> {
        try {
            const { razorpay_order_id, razorpay_payment_id, razorpay_signature, 
                    userId, planType, amount, planId 
                  } = razorpaySubscriptionPaymentData;

            const isValid = await this.razorpay.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });
            if (!isValid) { return null }

            const primeData = await this.setPrimeData(planType, userId, (amount / 100));
            const result = await this.userRepository.updatePrimeById(userId, primeData );
            await this.salesRepository.create({
                userId,
                subscriptionId: planId,
                saleType: SaleType.SUBSCRIPTION,
                billedAmount: (amount / 100),
                planType,
            });

            await this.cashBack(userId, amount);
            paymentInProgress[userId] = false;

            if (!result) { return null }

            return result
        } catch (error) {
            throw new Error('something happend in  verifyPayment')
        }

    }

    async paymentUsingWallet(paymentData: {userId: string, planType: string, amount: number, planId: string}): Promise<UserDTO | null> {
        try {
            const { userId, planType, amount,planId  } = paymentData;

            const primeData = await this.setPrimeData(planType, userId, amount);
            const result = await this.userRepository.updatePrimeById(userId, primeData);
            await this.salesRepository.create({
                userId,
                subscriptionId: planId,
                saleType: SaleType.SUBSCRIPTION,
                billedAmount: amount ,
                planType,
            });
            await this.cashBack(userId, amount);

            if (!result) { return null }
            return result;
        } catch (error) {
            throw new Error('something happend in   paymentUsingWallet');
        }
    };



}