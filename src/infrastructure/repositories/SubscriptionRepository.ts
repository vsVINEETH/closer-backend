import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import { Subscription } from "../../domain/entities/Subscription";
import { SubscriptionDTO } from "../../usecases/dtos/SubscriptionDTO";
import { SubscriptionModel } from "../persistence/models/SubscriptionModel";
import { SortOrder } from "../config/database";
export class SubscriptionRepository implements ISubscriptionRepository {
  async findAll<T>( query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0): Promise<{subscription: SubscriptionDTO[], total: number} | null> {
    try {
      const data = await SubscriptionModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
      
      const total = await SubscriptionModel.countDocuments(query)
      return {subscription: data, total: total}
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  }

  async findById(subscriptionId: string): Promise<SubscriptionDTO | null> {
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
    subscriptionId: string,
    field: string,
    value: string
  ): Promise<boolean | null> {
    try {
      const updateData = { [field]: parseInt(value) };
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
