import { Subscription } from "../entities/Subscription";
import {SortOrder} from '../../../types/express/index'
export interface ISubscriptionRepository {
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise< Subscription[] | null>
    findById(subscriptionId: string): Promise<Subscription| null>;
    countDocs<T>(query: Record<string, T> ): Promise<number>
    listById(subscriptionId: string, status: boolean): Promise<boolean | null>;
  //  updateById(subscriptionId:string, latestData:{ [field: string]: number}): Promise<boolean | null>;
    update(subscriptionId: string, updateData:{ [field: string]: number }): Promise<Subscription | null>
}