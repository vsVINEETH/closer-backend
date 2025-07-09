export interface ITransaction {
    amount: number;
    description: string;
    paymentType:string,
    createdAt: Date;
    updatedAt: Date;
  }

  export interface Transaction  {
    amount: number;
    description: string;
    paymentType: string; 
    createdAt: string;
    updatedAt: string;
  }

export interface WalletDTO {
    id:string,
    userId: string;
    balance: number;
    transactions: ITransaction[];
    createdAt: Date;
  }

  export type RazorpayWalletPaymentData = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    userId: string;
    amount: number;
    description: string;
  }
  