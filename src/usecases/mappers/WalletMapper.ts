import { IWallet } from "../../infrastructure/persistence/interfaces/IWalletModel";
import { Wallet, Transaction } from "../../domain/entities/Wallet";
import { WalletDTO } from "../dtos/WalletDTO";


export function toEntity(wallet: IWallet): Wallet | null {
  try {
    if (!wallet) return null;

    const transactions: Transaction[] = wallet.transactions.map((txn) => ({
      amount: txn.amount,
      description: txn.description,
      paymentType: txn.paymentType,
      createdAt: txn.createdAt, // Convert Date → string
      updatedAt: txn.updatedAt,
    }));

    return new Wallet(
      wallet.id,
      wallet.userId,
      wallet.balance,
      transactions,
      wallet.createdAt,
      wallet.updatedAt
    );
  } catch (error) {
    throw new Error("Something happened in toEntity");
  }
}

export function toDTO(wallet: Wallet ): WalletDTO {

    try {
        return {
            id: wallet.id,
            userId: wallet.userId,
            balance: wallet.balance,
            transactions: wallet.transactions,
            createdAt: wallet.createdAt,
        };
    } catch (error) {
       throw new Error('Something happend in toDTO') 
    };
};