import { WalletDTO } from "../../usecases/dtos/WalletDTO";

export interface IWalletRepository {
    create(userId: string): Promise<void>;
    findById(userId: string): Promise<WalletDTO | null>;
    addMoney(userId: string, amount: number, description: string): Promise<WalletDTO | null>;
    debitMoney(userId: string, amount: number, description: string): Promise<WalletDTO | null>;
}