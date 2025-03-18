import { IWalletRepository } from "../../domain/repositories/IWalletRepository";
import WalletModel from "../persistence/models/WalletModel";
import { WalletDTO } from "../../usecases/dtos/WalletDTO";

export class WalletRepository implements IWalletRepository {
  async findById(userId: string): Promise<WalletDTO | null> {
    try {
      const wallet = await WalletModel.aggregate([
        { $match: { userId } },
        {
          $addFields: {
            transactions: { $sortArray: { input: "$transactions", sortBy: { createdAt: -1 } } },
          },
        },
      ]);
  
      return wallet.length > 0
        ? {
            id: wallet[0].id,
            userId: wallet[0].userId,
            balance: wallet[0].balance,
            transactions: wallet[0].transactions,
            createdAt: wallet[0].createdAt,
          }
        : null;
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
  }

  async addMoney(
    userId: string,
    amount: number,
    description: string
  ): Promise<WalletDTO | null> {
    try {
      const wallet = await WalletModel.findOne({ userId: userId });
      if (!wallet) {
        return wallet;
      }
      const convertedAmount = amount / 100;

      wallet.balance += convertedAmount;

      const transaction = {
        amount: convertedAmount,
        description,
        paymentType: "debit",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      wallet.transactions.push(transaction);
      await wallet.save();

      return {
        id: wallet.id,
        userId: wallet.userId.toString(),
        balance: wallet.balance,
        transactions: wallet.transactions,
        createdAt: wallet.createdAt,
      };
    } catch (error) {
      throw new Error("something happend in addMoney");
    }
  }

  async debitMoney(
    userId: string,
    amount: number,
    description: string
  ): Promise<WalletDTO | null> {
    try {
      const wallet = await WalletModel.findOne({ userId: userId });
      if (!wallet) {
        return wallet;
      }

      wallet.balance -= amount;

      const transaction = {
        amount,
        description,
        paymentType: "credit",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      wallet.transactions.push(transaction);
      await wallet.save();

      return {
        id: wallet.id,
        userId: wallet.userId.toString(),
        balance: wallet.balance,
        transactions: wallet.transactions,
        createdAt: wallet.createdAt,
      };
    } catch (error) {
      throw new Error("something happend in debitMoney");
    }
  }
}
