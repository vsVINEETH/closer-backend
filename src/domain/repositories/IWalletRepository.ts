import { WalletTransaction } from "../../usecases/dtos/WalletDTO";
import { Wallet } from "../entities/Wallet";
import { WalletPersistanceType } from "../../infrastructure/types/WalletType";

export interface IWalletRepository {
    create(walletData: WalletPersistanceType): Promise<Wallet>;
    findTransactionById(userId: string): Promise<Wallet | null>;
    findOne(userId: string): Promise<Wallet | null>
    // addMoney(userId: string, transaction: WalletTransaction ): Promise<Wallet | null>;
    // debitMoney(userId: string, transaction: WalletTransaction ): Promise<Wallet | null>;
    updateTransaction( userId: string, transaction: WalletTransaction ): Promise<Wallet | null>;
};