import mongoose,{ Document } from "mongoose";

export interface ITransaction {
  amount: number;
  description: string;
  paymentType: string; // Should be a simple string
  createdAt: Date;
  updatedAt: Date;
}

  
// Interface for Wallet Model
export interface IWalletDocument extends Document {
    userId: string;
    balance: number;
    transactions: ITransaction[];
    createdAt: Date;
    updatedAt: Date;
  }