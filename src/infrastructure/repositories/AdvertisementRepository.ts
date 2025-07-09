import { IAdvertisementRepository } from "../../domain/repositories/IAdvertisementRepository";
import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementModel } from "../persistence/models/AdvertisementModel";
import { AdvertisementDTO } from "../../usecases/dtos/AdvertisementDTO";
import { SortOrder } from "../../../types/express/index";
import { AdvertisementDocument } from "../persistence/interfaces/IAdvertisement";

export class AdvertisementRepository implements IAdvertisementRepository {
  async findAll<T>( 
      query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0
    ): Promise< AdvertisementDocument[]| null> {
    try {
      const adDoc = await AdvertisementModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

      return adDoc;
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
    }
  };

  async findById(advertisementId: string): Promise<AdvertisementDocument | null> {
    try {
      const adDoc = await AdvertisementModel.findById(advertisementId);
      return adDoc;
    } catch (error) {
      throw new Error("something happend findById");
    }
  };

  async create(advertisementData: Partial<AdvertisementDocument>): Promise<boolean> {
    try {
      const newAdvertisement = new AdvertisementModel(advertisementData);
      await newAdvertisement.save();
      return true;
    } catch (error) {
      throw new Error("something happend in create");
    }
  };

  async update(adId: string, advertisementData: Partial<AdvertisementDocument>): Promise<boolean> {
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
