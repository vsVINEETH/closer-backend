import { WalletDTO } from "../../usecases/dtos/WalletDTO";
import { Wallet } from "../../domain/entities/Wallet";

export function toWalletDTO(entity: Wallet): WalletDTO {
    try {
       return {
         id: entity.id,
         userId: entity.userId,
         balance: entity.balance,
         transactions: entity.transactions,
         createdAt: entity.createdAt
       };
    } catch (error) {
       throw new Error('Something happend in toWalletDTO') 
    };
};

export function toWalletDTOs(entities: Wallet[]): WalletDTO[]{
    try {
       return entities.map((en) => ({
         id: en.id,
         userId: en.userId,
         balance: en.balance,
         transactions: en.transactions,
         createdAt: en.createdAt
       })) 
    } catch (error) {
       throw new Error('Something happend in toWalletDTOs') 
    };
};