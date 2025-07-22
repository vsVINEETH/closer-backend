import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { toTransaction, toWalletPersistance } from "../../../infrastructure/mappers/walletDataMapper";
import { toWalletDTO } from "../../../interfaces/mappers/walletDTOMapper";
import { WalletDTO, PaymentOrderDTO, RazorpayWalletPaymentDTO } from "../../dtos/WalletDTO";
import { IRazorpay } from "../../interfaces/IRazorpay";
import { IUserWalletUseCase } from "../../interfaces/user/IWalletUseCase";

export class WalletManagement implements IUserWalletUseCase {
    constructor(
        private _walletRepository: IWalletRepository,
        private _razorpay: IRazorpay
    ) { }

    async fetchData(userId: string): Promise<WalletDTO | null > {
        try {
            const walletData = await this._walletRepository.findTransactionById(userId);
            if (!walletData) {
               await this._walletRepository.create(toWalletPersistance(userId));
            } else {
                return walletData ? toWalletDTO(walletData) : null;
            };
            return null;
        } catch (error) {
            throw new Error('something happend in fetchData')
        };
    };

    async createOrder(paymentOrderData: PaymentOrderDTO): Promise<boolean | null> {
        try {
            const { amount, currency } = paymentOrderData;
            return await this._razorpay.createOrder(amount, currency);
        } catch (error) {
            throw new Error('something happend in createOrder')
        };
    };

    async verifyPayment(razorpayWalletPaymentData: RazorpayWalletPaymentDTO): Promise<WalletDTO | null> {
        try {
            const { razorpay_order_id, razorpay_payment_id, 
                   razorpay_signature, userId, amount, description 
                  } = razorpayWalletPaymentData;

            const isValid = await this._razorpay.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });

            if (!isValid) return null;

            let convertedAmount = amount / 100;
            const walletData = toTransaction({amount: convertedAmount, description, paymentType:'credit'})
            const wallet = await this._walletRepository.updateTransaction(userId, walletData);
            return wallet ? toWalletDTO(wallet) : null;

        } catch (error) {
            throw new Error('something happend in verifyPayment')
        };
    };

    async payWithWallet(userId: string, amount: number , description: string): Promise<WalletDTO | null> {
        try {
            
            const walletData = await this._walletRepository.findTransactionById(userId);
            if (!walletData) { return null }
           
            if (walletData?.balance < amount) {
                return null
            } else {
                const walletData = toTransaction({amount: -amount, description, paymentType:'debit'});
                const wallet = await this._walletRepository.updateTransaction(userId, walletData);
                return wallet ? toWalletDTO(wallet): null;
            };
        } catch (error) {
            throw new Error('something happend in payWithWallet');
        };
    };
};