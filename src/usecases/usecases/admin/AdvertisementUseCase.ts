import { IAdvertisementRepository } from "../../../domain/repositories/IAdvertisementRepository";
import { AdvertisementDTO } from "../../dtos/AdvertisementDTO";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { paramToQueryAdvertisement } from "../../../interfaces/utils/paramToQuery";
import { IS3Client } from "../../interfaces/IS3Client";

export class AdvertisementManagement {
    constructor(
        private advertisementRepository: IAdvertisementRepository,
        private s3: IS3Client
    ) { };


    private async getValuesFromS3Bucket (advertisementData:{advertisements: AdvertisementDTO[], total: number }) {
        if (advertisementData?.advertisements) {
            await Promise.all(
                advertisementData.advertisements.map(async (doc) => {
                    doc.image = await Promise.all(
                        doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                    );
                })
            );
        };
    };

    async fetchData(query: SearchFilterSortParams ): Promise<{advertisement: AdvertisementDTO[], total: number } | null> {
        try {
            let advertisementData;
            if(query){
                const queryResult = await paramToQueryAdvertisement(query);
                advertisementData = await this.advertisementRepository.findAll(
                    queryResult.query, 
                    queryResult.sort, 
                    queryResult.skip, 
                    queryResult.limit
                );

            } else {
              advertisementData = await this.advertisementRepository.findAll();
            };

            if (advertisementData?.advertisements) {
                await Promise.all(
                    advertisementData.advertisements.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };
        
            return advertisementData ? {advertisement: advertisementData.advertisements, total: advertisementData.total} : null;
        } catch (error) {
            throw new Error("something happend in fetchData");
        }
    };

    async createAdvertisement(advertisementData: AdvertisementDTO, query: SearchFilterSortParams, imageFiles:  Express.MulterS3.File[]): Promise<{advertisement: AdvertisementDTO[], total: number } | null>{
        try {
            const image: string[] = [];
              for(let post of imageFiles){
                 const fileName = await this.s3.uploadToS3(post);
                 image.push(fileName);
              };

            const result = await this.advertisementRepository.create({...advertisementData, image});
            if (result) {
                const queryResult = await paramToQueryAdvertisement(query)
                const advertisement = await this.advertisementRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );

                if (advertisement?.advertisements) {
                    await Promise.all(
                        advertisement.advertisements.map(async (doc) => {
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        })
                    );
                };

                return {advertisement: advertisement?.advertisements ?? [], total: advertisement?.total ?? 0}
            }
            return null;
        } catch (error) {
            throw new Error("something happend in createAdvertisement");
        }
    }

    async updateAdvertisement(updatedAdvertisementData: AdvertisementDTO, query: SearchFilterSortParams): Promise<{advertisement: AdvertisementDTO[], total: number }| null> {
        try {
            const result = await this.advertisementRepository.update(updatedAdvertisementData);
            if (result) {
                const queryResult = await paramToQueryAdvertisement(query);
                const advertisement = await this.advertisementRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );

                if (advertisement?.advertisements) {
                    await Promise.all(
                        advertisement.advertisements.map(async (doc) => {
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        })
                    );
                };

                return { advertisement: advertisement?.advertisements ?? [], total: advertisement?.total ?? 0 };
            };
            return null;
        } catch (error) {
            throw new Error("something happend in updateAdvertisement");
        }
    }

    async handleListing(advertisementId: string, query: SearchFilterSortParams): Promise<{advertisement: AdvertisementDTO[], total: number } | null> {
        try {
            const advertisement = await this.advertisementRepository.findById(advertisementId);

            if (advertisement) {
                const status: boolean = !advertisement.isListed;
                const result = await this.advertisementRepository.listById(advertisementId, status);
                if (result) {
                    const queryResult = await paramToQueryAdvertisement(query);
                    const advertisement = await this.advertisementRepository.findAll(
                        queryResult.query,
                        queryResult.sort,
                        queryResult.skip,
                        queryResult.limit
                    );

                    if (advertisement?.advertisements) {
                        await Promise.all(
                            advertisement.advertisements.map(async (doc) => {
                                doc.image = await Promise.all(
                                    doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                                );
                            })
                        );
                    };
                    return { advertisement: advertisement?.advertisements ?? [], total: advertisement?.total ?? 0 };
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
            const advertisement = await this.advertisementRepository.findById(advertisementId)
           
            if (advertisement) {
                await Promise.all(
                    advertisement.image.map(async (val) => await this.s3.deleteFromS3(val as string))
                );
                advertisement.image = [];
            };

            const content = await this.advertisementRepository.deleteById(advertisementId);
            if (content) {
                const queryResult = await paramToQueryAdvertisement(query);
                const advertisement = await this.advertisementRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );
                if (advertisement?.advertisements) {
                    await Promise.all(
                        advertisement.advertisements.map(async (doc) => {
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        })
                    );
                };
                return { advertisement: advertisement?.advertisements ?? [], total: advertisement?.total ?? 0 };
            };
            return null;
        } catch (error) {
            throw new Error("something happend in deleteAdvertisement");
        }
    };

}
