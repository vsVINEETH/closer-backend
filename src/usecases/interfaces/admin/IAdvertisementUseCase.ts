import { AdvertisementDTO } from "../../dtos/AdvertisementDTO";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { AdvertisementUseCaseResponse } from "../../types/AdvertisementTypes";

export interface IAdvertisementUseCase {
   fetchData(query: SearchFilterSortParams ): Promise< AdvertisementUseCaseResponse | null>
   createAdvertisement(advertisementData: AdvertisementDTO, query: SearchFilterSortParams, imageFiles:  Express.Multer.File[]): Promise<AdvertisementUseCaseResponse | null>
   updateAdvertisement(updatedAdvertisementData: AdvertisementDTO, query: SearchFilterSortParams): Promise<AdvertisementUseCaseResponse| null>;
   handleListing(advertisementId: string, query: SearchFilterSortParams): Promise<AdvertisementUseCaseResponse| null>;
   deleteAdvertisement(advertisementId: string, query: SearchFilterSortParams): Promise<AdvertisementUseCaseResponse | null>
};