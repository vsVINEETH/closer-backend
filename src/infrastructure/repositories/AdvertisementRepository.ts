import { IAdvertisementRepository } from "../../domain/repositories/IAdvertisementRepository";
import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementModel } from "../persistence/models/AdvertisementModel";
import { SortOrder } from "../../../types/express/index";
import { toAdvertisementEntityFromDoc, toAdvertisementEntitiesFromDoc } from "../mappers/advertisementDataMapper";
import { AdvertisementUpdateType } from "../types/AdvertisementType";

export class AdvertisementRepository implements IAdvertisementRepository {
  async findAll<T>( 
      query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0
    ): Promise< Advertisement[]| null> {
    try {
      const adDoc = await AdvertisementModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);
      return adDoc ? toAdvertisementEntitiesFromDoc(adDoc) : null;
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  };

  async countDocs<T>(query: Record<string, T> = {}): Promise<number> {
    try {
      const totalDocs = await AdvertisementModel.countDocuments(query);
      return totalDocs;
    } catch (error) {
      throw new Error("something happend in countDocs");
    };
  };

  async findById(advertisementId: string): Promise<Advertisement| null> {
    try {
      const adDoc = await AdvertisementModel.findById(advertisementId);
      return adDoc ? toAdvertisementEntityFromDoc(adDoc) : null;
    } catch (error) {
      throw new Error("something happend findById");
    }
  };

  async create(advertisementData: Advertisement): Promise<boolean> {
    try {
      const newAdvertisement = new AdvertisementModel(advertisementData);
      await newAdvertisement.save();
      return true;
    } catch (error) {
      throw new Error("something happend in create");
    }
  };

  async update(adId: string, advertisementData: AdvertisementUpdateType): Promise<boolean> {
    try {
      const adDoc = await AdvertisementModel.findByIdAndUpdate(
        adId,
        advertisementData,
        { new: true }
      );
      return adDoc !== null;
    } catch (error) {
      throw new Error("something happend in update");
    }
  };

  async listById( advertisementId:string, advertisementStatus: boolean): Promise<boolean | null> {
    try {
      const adDoc = await AdvertisementModel.findByIdAndUpdate(
        advertisementId,
        {
          isListed: advertisementStatus,
        },
        { new: true }
      );
      return adDoc !== null;
    } catch (error) {
      throw new Error("something happend in listById");
    }
  };

  async deleteById(advertisementId: string): Promise<boolean | null> {
    try {
      const adDoc = await AdvertisementModel.findByIdAndDelete(
        advertisementId, 
      {
        new: true,
      });
      return adDoc !== null;
    } catch (error) {
      throw new Error("something happend in deleteById");
    }
  };
  
};
