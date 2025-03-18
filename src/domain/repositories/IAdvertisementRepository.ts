import { AdvertisementDTO } from "../../usecases/dtos/AdvertisementDTO";
import {SortOrder} from '../../../types/express/index'
export interface IAdvertisementRepository {
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise< { advertisements:AdvertisementDTO[], total: number} | null>,
    findById(advertisementId: string): Promise<AdvertisementDTO | null>;
    create(advertisementData: AdvertisementDTO): Promise<boolean>;
    update(advertisementData: AdvertisementDTO): Promise<boolean>
    listById(advertisementId: string, advertisementStatus: boolean): Promise<boolean | null>
    deleteById(advertisementId: string): Promise<boolean | null>
}