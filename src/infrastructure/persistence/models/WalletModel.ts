import mongoose, {Schema } from "mongoose";
import { ITransaction, IWallet } from "../interfaces/IWalletModel";


const TransactionSchema = new Schema<ITransaction>(
  {
    amount: { type: Number, required: true },
    description: { type: String, required: true },
    paymentType: { 
      type: String, 
      required: true, 
      enum: ['debit', 'credit']
    }
  },
  { timestamps: true }
);


const WalletSchema = new Schema<IWallet>(
  {
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    transactions: [TransactionSchema],
  },
  { timestamps: true } 
);

const WalletModel = mongoose.model<IWallet>("Wallet", WalletSchema);
export default WalletModel;
