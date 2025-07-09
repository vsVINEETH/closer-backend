import { SubscriptionDTO } from "../../usecases/dtos/SubscriptionDTO";
import { Subscription } from "../entities/Subscription";
import {SortOrder} from '../../../types/express/index'
import { SubscriptionDocument } from "../../infrastructure/persistence/interfaces/ISubscription";
export interface ISubscriptionRepository {
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise< SubscriptionDocument[] | null>
    findById(subscriptionId: string): Promise<SubscriptionDocument | null>;
    countDocs<T>(query: Record<string, T> ): Promise<number>
    listById(subscriptionId: string, status: boolean): Promise<boolean | null>;
    updateById(subscriptionId:string, latestData:{ [field: string]: number}): Promise<boolean | null>;
}