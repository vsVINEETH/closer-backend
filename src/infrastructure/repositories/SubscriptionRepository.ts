import { ISubscriptionRepository } from "../../domain/repositories/ISubscriptionRepository";
import { SubscriptionModel } from "../persistence/models/SubscriptionModel";
import { SortOrder } from "../config/database";
import { ISubscriptionDocument } from "../persistence/interfaces/ISubscription";
import { toSubscriptionEntitiesFromDocs, toSubscriptionEntityFromDoc } from "../mappers/subscriptionDataMapper";
import { Subscription } from "../../domain/entities/Subscription";
import { BaseRepository } from "./BaseRepository";
export class SubscriptionRepository extends BaseRepository<Subscription, ISubscriptionDocument> implements ISubscriptionRepository {

  constructor(){
    super(SubscriptionModel, toSubscriptionEntityFromDoc, toSubscriptionEntitiesFromDocs)
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
    };
  };

};
