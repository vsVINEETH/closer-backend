import { IAdvertisementRepository } from "../../../domain/repositories/IAdvertisementRepository";
import { AdvertisementDTO } from "../../dtos/AdvertisementDTO";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { paramToQueryAdvertisement } from "../../../interfaces/utils/paramToQuery";
import { IS3Client } from "../../interfaces/IS3Client";
import { toEntities, toDTOs, toEntity, toDTO, toPersistance, toUpdate } from "../../mappers/AdvertisementMappter";

export class AdvertisementManagement {
    constructor(
        private advertisementRepository: IAdvertisementRepository,
        private s3: IS3Client
    ) { };


    async fetchData(query: SearchFilterSortParams ): Promise<{advertisement: AdvertisementDTO[], total: number } | null> {
        try {
            let advertisementData;
            let total; 
            if(query){
                const queryResult = await paramToQueryAdvertisement(query);
                total = await this.advertisementRepository.countDocs(queryResult.query);
                advertisementData = await this.advertisementRepository.findAll(
                    queryResult.query, 
                    queryResult.sort, 
                    queryResult.skip, 
                    queryResult.limit
                );

            } else {
              advertisementData = await this.advertisementRepository.findAll();
              total = await this.advertisementRepository.countDocs({});
            };

            if(advertisementData === null) return null;
            const advertisements = toEntities(advertisementData);

            if(advertisements === null) return null;
            const advertisementDTO = toDTOs(advertisements);

            if (advertisementDTO?.advertisements) {
                await Promise.all(
                    advertisementDTO.advertisements.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };
        
            return advertisementData ? {advertisement: advertisementDTO.advertisements, total} : null;
        } catch (error) {
            throw new Error("something happend in fetchData");
        };
    };

    async createAdvertisement(advertisementData: AdvertisementDTO, query: SearchFilterSortParams, imageFiles:  Express.MulterS3.File[]): Promise<{advertisement: AdvertisementDTO[], total: number } | null>{
        try {
            const image: string[] = [];
              for(let post of imageFiles){
                 const fileName = await this.s3.uploadToS3(post);
                 image.push(fileName);
              };

            let total; 
            const dataToPersist = toPersistance({...advertisementData, image});
            const result = await this.advertisementRepository.create(dataToPersist);
        
            if (result) {
                const queryResult = await paramToQueryAdvertisement(query)
                total = await this.advertisementRepository.countDocs(queryResult.query);
                const advertisements = await this.advertisementRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );

                if(advertisements === null) return null;
                const advertisementEntity = toEntities(advertisements);

                if(advertisementEntity === null) return null;
                const advertisementDTO = toDTOs(advertisementEntity);

                if (advertisementDTO?.advertisements) {
                    await Promise.all(
                        advertisementDTO.advertisements.map(async (doc) => {
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        })
                    );
                };

                return {advertisement: advertisementDTO?.advertisements ?? [], total: total ?? 0}
            }
            return null;
        } catch (error) {
            throw new Error("something happend in createAdvertisement");
        }
    }

    async updateAdvertisement(updatedAdvertisementData: AdvertisementDTO, query: SearchFilterSortParams): Promise<{advertisement: AdvertisementDTO[], total: number }| null> {
        try {

            const advertisementData = toUpdate(updatedAdvertisementData);
            const result = await this.advertisementRepository.update(updatedAdvertisementData.id, advertisementData);
            let total;
            if (result) {
                const queryResult = await paramToQueryAdvertisement(query);
                 total = await this.advertisementRepository.countDocs(queryResult.query);
                const advertisements = await this.advertisementRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );

                if(advertisements === null) return null;
                const advertisementEntity = toEntities(advertisements);

                if(advertisementEntity === null) return null;
                const advertisementDTO = toDTOs(advertisementEntity);

                if (advertisementDTO?.advertisements) {
                    await Promise.all(
                        advertisementDTO.advertisements.map(async (doc) => {
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        })
                    );
                };

                return { advertisement: advertisementDTO?.advertisements ?? [], total: total ?? 0 };
            };
            return null;
        } catch (error) {
            throw new Error("something happend in updateAdvertisement");
        }
    }

    async handleListing(advertisementId: string, query: SearchFilterSortParams): Promise<{advertisement: AdvertisementDTO[], total: number } | null> {
        try {
            const adDocs = await this.advertisementRepository.findById(advertisementId);
            
            if(adDocs === null) return null;
            const advertisementEntity = toEntity(adDocs);
           
            if(advertisementEntity === null) return null;
            const advertisement = toDTO(advertisementEntity)

            if (advertisement) {
                const status: boolean = !advertisement.isListed;
                const result = await this.advertisementRepository.listById(advertisementId, status);
                let total;
                if (result) {
                    const queryResult = await paramToQueryAdvertisement(query);
                    total = await this.advertisementRepository.countDocs(queryResult.query);
                    const advertisements = await this.advertisementRepository.findAll(
                        queryResult.query,
                        queryResult.sort,
                        queryResult.skip,
                        queryResult.limit
                    );


                    if(advertisements === null) return null;
                    const advertisementEntity = toEntities(advertisements);

                    if(advertisementEntity === null) return null;
                    const advertisementDTO = toDTOs(advertisementEntity);

                    if (advertisementDTO?.advertisements) {
                        await Promise.all(
                            advertisementDTO.advertisements.map(async (doc) => {
                                doc.image = await Promise.all(
                                    doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                                );
                            })
                        );
                    };
                    return { advertisement: advertisementDTO?.advertisements ?? [], total: total ?? 0 };
                }
                return null;
            }

            return null;
        } catch (error) {
            throw new Error("something happend in handleListing");
        }
    }

    async deleteAdvertisement(advertisementId: string, query: SearchFilterSortParams): Promise<{advertisement: AdvertisementDTO[], total: number } | null> {
        try {
            const adDocs = await this.advertisementRepository.findById(advertisementId)

            if(adDocs === null) return null;
            const advertisementEntity = toEntity(adDocs);
           
            if(advertisementEntity === null) return null;
            const advertisement = toDTO(advertisementEntity)
           
            if (advertisement) {
                await Promise.all(
                    advertisement.image.map(async (val) => await this.s3.deleteFromS3(val as string))
                );
                advertisement.image = [];
            };

            const content = await this.advertisementRepository.deleteById(advertisementId);
            let total;
            if (content) {
                const queryResult = await paramToQueryAdvertisement(query);
                total = await this.advertisementRepository.countDocs(queryResult.query);
                const advertisements = await this.advertisementRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );

                if(advertisements === null) return null;
                const advertisementEntity = toEntities(advertisements);

                if(advertisementEntity === null) return null;
                const advertisementDTO = toDTOs(advertisementEntity);

                if (advertisementDTO?.advertisements) {
                    await Promise.all(
                        advertisementDTO.advertisements.map(async (doc) => {
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        })
                    );
                };
                return { advertisement: advertisementDTO?.advertisements ?? [], total: total ?? 0 };
            };
            return null;
        } catch (error) {
            throw new Error("something happend in deleteAdvertisement");
        }
    };

}
