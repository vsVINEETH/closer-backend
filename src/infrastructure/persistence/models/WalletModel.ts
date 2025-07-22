import mongoose, {Schema } from "mongoose";
import { ITransaction, IWalletDocument } from "../interfaces/IWalletModel";


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


const WalletSchema = new Schema<IWalletDocument>(
  {
    userId: { type: String, required: true, unique: true },
    balance: { type: Number, default: 0 },
    transactions: [TransactionSchema],
  },
  { timestamps: true } 
);

const WalletModel = mongoose.model<IWalletDocument>("Wallet", WalletSchema);
export default WalletModel;
