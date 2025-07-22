import { PaymentOrderDTO, RazorpayWalletPaymentDTO, WalletDTO } from "../../dtos/WalletDTO";

export interface IUserWalletUseCase {
    fetchData(userId: string): Promise<WalletDTO | null >
    createOrder(paymentOrderData: PaymentOrderDTO): Promise<boolean | null>
    verifyPayment(razorpayWalletPaymentData: RazorpayWalletPaymentDTO): Promise<WalletDTO | null>
    payWithWallet(userId: string, amount: number , description: string): Promise<WalletDTO | null> 
}