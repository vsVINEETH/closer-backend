export interface SubscriptionDTO {
    id?: string,
    planType?:string,
    price?: number,
    isListed?:boolean,
    createdAt?: string
}

export interface Prime {
  id: string;
  planType: string;
  startDate: Date;
  endDate: Date | null;
  billedAmount: number;
}

export type SubscriptionUseCaseResponse = {
  subscription: SubscriptionDTO[],
   total: number
};


export type PaymentOrderDTO = {
  amount: number, 
  currency: string, 
  userId: string, 
  isPrime: boolean
};

export type PaymentDTO = {
  userId: string, 
  planType: string, 
  amount: number, 
  planId: string
}

export type RazorpaySubscriptionPaymentData = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    userId: string;
    amount: number;
    planId: string;
    planType: string;
  };


  export type SubscriptionPaymentWalletData = {
    purpose?: string;
    userId: string;
    amount: number;
    planId: string;
    planType: string;
    isPrime?: boolean;
  };
  
   export type SubscriptionPaymentData = {
    currency: string;
    amount: string;
    userId: string;
    planId: string;
    planType: string;
    isPrime: boolean;
  };