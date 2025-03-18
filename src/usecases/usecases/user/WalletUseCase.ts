import { IWalletRepository } from "../../../domain/repositories/IWalletRepository";
import { WalletDTO, RazorpayWalletPaymentData } from "../../dtos/WalletDTO";
import { IRazorpay } from "../../interfaces/IRazorpay";

export class WalletManagement {
    constructor(
        private walletRepository: IWalletRepository,
        private razorpay: IRazorpay
    ) { }


    async fetchData(userId: string): Promise<WalletDTO | null > {
        try {
            const data = await this.walletRepository.findById(userId);
            if (!data) {
               await this.walletRepository.create(userId)
            }
            return data;
        } catch (error) {
            throw new Error('something happend in fetchData')
        }

    }

    async createOrder(paymentOrderData: {amount: number, currency: string}): Promise<boolean | null> {
        try {
            const { amount, currency } = paymentOrderData;
            return await this.razorpay.createOrder(amount, currency);
        } catch (error) {
            throw new Error('something happend in createOrder')
        }

    }

    async verifyPayment(razorpayWalletPaymentData: RazorpayWalletPaymentData): Promise<WalletDTO | null> {
        try {
            const { razorpay_order_id, razorpay_payment_id, 
                   razorpay_signature, userId, amount, description 
                  } = razorpayWalletPaymentData;

            const isValid = await this.razorpay.verifyPayment({
                orderId: razorpay_order_id,
                paymentId: razorpay_payment_id,
                signature: razorpay_signature,
            });
            if (!isValid) { return null }

            const result = await this.walletRepository.addMoney(userId, amount, description)
            if (!result) { return null }
            return result
        } catch (error) {
            throw new Error('something happend in verifyPayment')
        }

    }

    async payWithWallet(userId: string, amount: number , description: string): Promise<WalletDTO | null> {
        try {
            const walletData = await this.walletRepository.findById(userId);
            if (!walletData) { return null }
            if (walletData?.balance < amount) {
                return null
            } else {
                const walletLatestData = await this.walletRepository.debitMoney(userId, amount, description);
                return walletLatestData;
            }
        } catch (error) {
            throw new Error('something happend in payWithWallet')
        }
    }

    
}