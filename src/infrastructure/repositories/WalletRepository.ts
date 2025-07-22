import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import WalletModel from "../persistence/models/WalletModel";
import { WalletTransaction } from "../../usecases/dtos/WalletDTO";
import { Wallet } from "../../domain/entities/Wallet";
import { toWalletEntitiesFromDocs, toWalletEntityFromDoc } from "../mappers/walletDataMapper";
import { WalletPersistanceType } from "../types/WalletType";
import { BaseRepository } from "./BaseRepository";
import { IWalletDocument } from "../persistence/interfaces/IWalletModel";

export class WalletRepository extends BaseRepository<Wallet, IWalletDocument> implements IWalletRepository {

  constructor(){
    super(WalletModel, toWalletEntityFromDoc, toWalletEntitiesFromDocs)
  };

  async findTransactionById(userId: string): Promise<Wallet | null> {
    try {
      const wallet = await WalletModel.aggregate([
        { $match: { userId } },
        {
          $addFields: {
            transactions: { $sortArray: { input: "$transactions", sortBy: { createdAt: -1 } } },
          },
        },
      ]);
      return wallet.length ? toWalletEntityFromDoc(wallet[0]): null;
    } catch (error) {
      throw new Error("Something happened in findById");
    };
  };

  async findOne(userId: string): Promise<Wallet | null> {
    try {
      const wallet = await WalletModel.findOne({userId: userId});
      return wallet ? toWalletEntityFromDoc(wallet): null;
    } catch (error) {
      throw new Error("Something happened in findById");
    };
  };

  async updateTransaction( userId: string, transaction: WalletTransaction ): Promise<Wallet | null> {
    try {
        const wallet = await WalletModel.findOneAndUpdate(
          { userId },
          {
            $inc: { balance: transaction.amount },
            $push: {
              transactions: {
                amount: transaction.amount,
                description: transaction.description,
                paymentType: transaction.paymentType,
                createdAt: new Date(),
                updatedAt: new Date(),
              }
            }
          },
          { new: true }          
        );
      return wallet ? toWalletEntityFromDoc(wallet): null;
    } catch (error) {
      throw new Error("something happend in addMoney");
    };
  };

};
