export interface IRazorpay {
    createOrder(amount: number, currency: string): Promise<any>;
    verifyPayment(data: any): Promise<boolean>;
  }
  