import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import { Subscription } from "../../domain/entities/Subscription";
import { SubscriptionDTO } from "../../usecases/dtos/SubscriptionDTO";
import { SubscriptionModel } from "../persistence/models/SubscriptionModel";
import { SortOrder } from "../config/database";
import { SubscriptionDocument } from "../persistence/interfaces/ISubscription";
export class SubscriptionRepository implements ISubscriptionRepository {
  
  async findAll<T>( query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0): Promise< SubscriptionDocument[] | null> {
    try {
      const subscriptionDocs = await SubscriptionModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
      return subscriptionDocs;
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  };

  async countDocs<T>(query: Record<string, T> = {}): Promise<number> {
    try {
      const totalDocs = await SubscriptionModel.countDocuments(query);
      return totalDocs;
    } catch (error) {
      throw new Error("something happend in countDocs");
    };
  };

  async findById(subscriptionId: string): Promise<SubscriptionDocument | null> {
    try {
      const data = await SubscriptionModel.findById(subscriptionId);
      return data;
    } catch (error) {
      throw new Error("something happend in findById");
    }
  }

  async listById(subscriptionId: string, status: boolean): Promise<boolean | null> {
    try {
      const data = await SubscriptionModel.findByIdAndUpdate(
        subscriptionId,
        {
          isListed: status,
        },
        { new: true }
      );
      return data !== null;
    } catch (error) {
      throw new Error("something happend in listById");
    }
  }

  async updateById(
    subscriptionId: string, updateData:{ [field: string]: number }

  ): Promise<boolean | null> {
    try {
      const data = await SubscriptionModel.findByIdAndUpdate(
        subscriptionId,
        {
          $set: updateData,
        },
        { new: true }
      );
      return data !== null;
    } catch (error) {
      throw new Error("something happend in updateById");
    }
  }
}
