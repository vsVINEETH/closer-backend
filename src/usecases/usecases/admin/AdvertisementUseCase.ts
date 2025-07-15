import { IAdvertisementRepository } from "../../../domain/repositories/IAdvertisementRepository";
import { AdvertisementDTO } from "../../dtos/AdvertisementDTO";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { paramToQueryAdvertisement } from "../../../interfaces/utils/paramToQuery";
import { IS3Client } from "../../interfaces/IS3Client";
import { toAdvertisementPersistance, toAdvertisementUpdate } from "../../../infrastructure/mappers/advertisementDataMapper";
import { AdvertisementUseCaseResponse } from "../../types/AdvertisementTypes";

export class AdvertisementManagement {
    constructor(
        private _advertisementRepository: IAdvertisementRepository,
        private _s3: IS3Client
    ) { };

    private async _fetchAndEnrich(query: SearchFilterSortParams): Promise<AdvertisementUseCaseResponse> {
        try {
           const queryResult = await paramToQueryAdvertisement(query);
            const total = await this._advertisementRepository.countDocs(queryResult.query);
            const advertisements = await this._advertisementRepository.findAll(
                queryResult.query,
                queryResult.sort,
                queryResult.skip,
                queryResult.limit
            );

            if (advertisements) {
                await Promise.all(
                advertisements.map(async (doc) => {
                    doc.image = await Promise.all(
                    doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                })
                );
            };
            return { advertisement: advertisements ?? [], total: total ?? 0 };  
        } catch (error) {
            throw new Error('Something happend fetchAndEnrich')
        };
    };

    async fetchData(query: SearchFilterSortParams ): Promise< AdvertisementUseCaseResponse | null> {
        try {
            const  advertisement = await this._fetchAndEnrich(query);
            return advertisement ?? null;
        } catch (error) {
            throw new Error("something happend in fetchData");
        };
    };

    async createAdvertisement(advertisementData: AdvertisementDTO, query: SearchFilterSortParams, imageFiles:  Express.MulterS3.File[]): Promise<AdvertisementUseCaseResponse | null>{
        try {
            const image: string[] = [];
              for(let post of imageFiles){
                 const fileName = await this._s3.uploadToS3(post);
                 image.push(fileName);
              };

            const dataToPersist = toAdvertisementPersistance({...advertisementData, image});
            const result = await this._advertisementRepository.create(dataToPersist);

            if (result) {
                const advertisements = await this._fetchAndEnrich(query);
                return advertisements ?? null;
            };

            return null;
        } catch (error) {
            throw new Error("something happend in createAdvertisement");
        };
    };

    async updateAdvertisement(updatedAdvertisementData: AdvertisementDTO, query: SearchFilterSortParams): Promise<AdvertisementUseCaseResponse| null> {
        try {

            const advertisementData = toAdvertisementUpdate(updatedAdvertisementData);
            const result = await this._advertisementRepository.update(updatedAdvertisementData.id, advertisementData);

            if (result) {
                const advertisements = await this._fetchAndEnrich(query);
                return advertisements ?? null;
            };
            return null;
        } catch (error) {
            throw new Error("something happend in updateAdvertisement");
        }
    };

    async handleListing(advertisementId: string, query: SearchFilterSortParams): Promise<AdvertisementUseCaseResponse| null> {
        try {

            const advertisement = await this._advertisementRepository.findById(advertisementId);
            if (advertisement) {
                const status: boolean = !advertisement.isListed;
                const result = await this._advertisementRepository.listById(advertisementId, status);

                if (result) {
                    const advertisements = await this._fetchAndEnrich(query);
                    return advertisements ?? null;
                };
            };

            return null;
        } catch (error) {
            throw new Error("something happend in handleListing");
        };
    };

    async deleteAdvertisement(advertisementId: string, query: SearchFilterSortParams): Promise<AdvertisementUseCaseResponse | null> {
        try {
            const advertisement = await this._advertisementRepository.findById(advertisementId);

            if (advertisement) {
                await Promise.all(
                    advertisement.image.map(async (val) => await this._s3.deleteFromS3(val as string))
                );
                advertisement.image = [];
            };

            const content = await this._advertisementRepository.deleteById(advertisementId);
            if (content) {
                const advertisements = await this._fetchAndEnrich(query);
                return advertisements ?? null;
            };
            return null;
        } catch (error) {
            throw new Error("something happend in deleteAdvertisement");
        }
    };

};
