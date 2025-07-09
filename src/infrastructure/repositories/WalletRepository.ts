import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import WalletModel from "../persistence/models/WalletModel";
import { WalletDTO } from "../../usecases/dtos/WalletDTO";
import { IWallet } from "../persistence/interfaces/IWalletModel";
export class WalletRepository implements IWalletRepository {

  async findById(userId: string): Promise<IWallet | null> {
    try {
      const wallet = await WalletModel.aggregate([
        { $match: { userId } },
        {
          $addFields: {
            transactions: { $sortArray: { input: "$transactions", sortBy: { createdAt: -1 } } },
          },
        },
      ]);
      return wallet[0] ?? null;
    } catch (error) {
      throw new Error("Something happened in findById");
    }
  };

  async findOne(userId: string): Promise<IWallet | null> {
    try {
      const wallet = await WalletModel.findOne({userId: userId});
      return wallet;
    } catch (error) {
      throw new Error("Something happened in findById");
    }
  }
  
  async create(userId: string): Promise< void> {
    try {
      const wallet = new WalletModel({
        userId,
        balance: 0,
        transactions: [],
      });
      await wallet.save();
      return
    } catch (error) {
      throw new Error("something happend in create");
    }
  };

  async addMoney( userId: string, transaction: WalletDTO): Promise<IWallet | null> {
    try {
       
        const wallet = await WalletModel.findOneAndUpdate(
          { userId },           
          { $set: transaction },     
          { new: true }              
        );
      return wallet;
    } catch (error) {
      throw new Error("something happend in addMoney");
    }
  };

  async debitMoney(
    userId: string,
    transaction: WalletDTO
  ): Promise<IWallet | null> {
    try {

      const wallet = await WalletModel.findOneAndUpdate(
          { userId },           
          { $set: transaction },     
          { new: true }              
        );
      return wallet;
      
    } catch (error) {
      throw new Error("something happend in debitMoney");
    }
  }
};
