import { AdvertisementDTO } from "../../usecases/dtos/AdvertisementDTO";
import {SortOrder} from '../../../types/express/index';
import { AdvertisementDocument } from "../../infrastructure/persistence/interfaces/IAdvertisement";
export interface IAdvertisementRepository {
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise< AdvertisementDocument[] | null>,
    countDocs<T>(query: Record<string, T>): Promise<number>
    findById(advertisementId: string): Promise<AdvertisementDocument | null>;
    create(advertisementData:  Partial<AdvertisementDocument>): Promise<boolean>;
    update(adId: string, advertisementData: Partial<AdvertisementDocument>): Promise<boolean>
    listById(advertisementId: string, advertisementStatus: boolean): Promise<boolean | null>
    deleteById(advertisementId: string): Promise<boolean | null>
}