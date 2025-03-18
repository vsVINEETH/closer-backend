import { SubscriptionDTO } from "../../usecases/dtos/SubscriptionDTO";
import { Subscription } from "../entities/Subscription";
import {SortOrder} from '../../../types/express/index'
export interface ISubscriptionRepository {
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<{subscription: SubscriptionDTO[], total: number} | null>
    findById(subscriptionId: string): Promise<SubscriptionDTO | null>;
    listById(subscriptionId: string, status: boolean): Promise<boolean | null>;
    updateById(subscriptionId:string, field: string, value: string): Promise<boolean | null>;
}