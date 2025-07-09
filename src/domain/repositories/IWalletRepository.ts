import { WalletDTO } from "../../usecases/dtos/WalletDTO";
import { IWallet } from "../../infrastructure/persistence/interfaces/IWalletModel";
export interface IWalletRepository {
    create(userId: string): Promise<void>;
    findById(userId: string): Promise<IWallet | null>;
    findOne(userId: string): Promise<IWallet | null>
    addMoney(userId: string, transaction: WalletDTO ): Promise<IWallet | null>;
    debitMoney(userId: string, transaction: WalletDTO ): Promise<IWallet | null>;
}