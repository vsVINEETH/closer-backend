import { Wallet } from "../../domain/entities/Wallet";
import { WalletTransaction } from "../../usecases/dtos/WalletDTO";
import { IWalletDocument } from "../persistence/interfaces/IWalletModel";
import { WalletPersistanceType } from "../types/WalletType";

export function toWalletEntityFromDoc(doc: IWalletDocument): Wallet {
    try {
        console.log(doc,'hell')
      return new Wallet({
        id: doc.id,
        userId: doc.userId,
        balance: doc.balance,
        transactions: doc.transactions,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }); 
    
    } catch (error) {
       throw new Error('Something happend in toWalletEntityFromDoc') 
    };
};

export function toWalletEntitiesFromDocs(docs: IWalletDocument[]): Wallet[] {
    try {
       return docs.map((doc) => (
        new Wallet({
            id: doc.id,
            userId: doc.userId,
            balance: doc.balance,
            transactions: doc.transactions,
            createdAt: doc.createdAt,
            updatedAt: doc.updatedAt,  
        })
       ));
    } catch (error) {
       throw new Error('Something happend in toWalletEntitiesFromDocs');
    };
};



export function toWalletPersistance(userId: string ): WalletPersistanceType {
    try {
        return {
            userId,
            balance:0,
            transactions:[]
        };
    } catch (error) {
      throw new Error('Something happend in toWalletPersistance')  
    };
};

export function toTransaction(transaction:{amount: number, paymentType: string, description: string}): WalletTransaction {
    try {
        return{
            amount:transaction.amount,
            paymentType: transaction.paymentType,
            description: transaction.description
        };  
    } catch (error) {
       throw new Error('Something happend in toTransaction')
    };
};
