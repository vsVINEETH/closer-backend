import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { PaymentDTO, PaymentOrderDTO, RazorpaySubscriptionPaymentData, SubscriptionDTO, SubscriptionUseCaseResponse } from "../../dtos/SubscriptionDTO";
import { UserDTO } from "../../dtos/UserDTO";

export interface ISubscriptionUseCase {
    fetchData(options?: SearchFilterSortParams): Promise<SubscriptionUseCaseResponse | null>
    handleListing(subscriptionId: string, query: SearchFilterSortParams): Promise<SubscriptionUseCaseResponse| null>
    update(subscriptionId: string, field: string, value: string, query: SearchFilterSortParams): Promise<SubscriptionUseCaseResponse| null>
    selectedPlan(subscriptionId: string): Promise<SubscriptionDTO | null>
    createOrder(paymentOrderData: PaymentOrderDTO): Promise<boolean | null | string >
    abortPayment(userId: string): Promise<boolean>
    verifyPayment(razorpaySubscriptionPaymentData: RazorpaySubscriptionPaymentData): Promise<UserDTO | null> 
    paymentUsingWallet(paymentData: PaymentDTO): Promise<UserDTO | null>
}