import {SortOrder} from '../../../types/express/index';
import { Advertisement } from "../entities/Advertisement";
import { AdvertisementPersistenceType, AdvertisementUpdateType } from "../../infrastructure/types/AdvertisementType";
export interface IAdvertisementRepository {
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise< Advertisement[] | null>,
    countDocs<T>(query: Record<string, T>): Promise<number>
    findById(advertisementId: string): Promise<Advertisement | null>;
    create(advertisementData:  AdvertisementPersistenceType): Promise<boolean>;
    update(adId: string, advertisementData: AdvertisementUpdateType): Promise<boolean>
    listById(advertisementId: string, advertisementStatus: boolean): Promise<boolean | null>
    deleteById(advertisementId: string): Promise<boolean | null>
};