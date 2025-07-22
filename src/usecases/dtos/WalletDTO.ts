export interface ITransaction {
    amount: number;
    description: string;
    paymentType:string,
    createdAt: Date;
    updatedAt: Date;
  }

  export type PaymentOrderDTO = {
    amount: number, 
    currency: string
  }

  export interface Transaction  {
    amount: number;
    description: string;
    paymentType: string; 
    createdAt: string;
    updatedAt: string;
  }
  
  export interface WalletTransaction  {
    amount: number;
    description: string;
    paymentType: string; 
  }


export interface WalletDTO {
    id:string,
    userId: string;
    balance: number;
    transactions: ITransaction[];
    createdAt: Date;
  }

  export type RazorpayWalletPaymentDTO = {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    userId: string;
    amount: number;
    description: string;
  }
  