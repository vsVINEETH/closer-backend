import { IAdvertisementRepository } from "../../domain/repositories/IAdvertisementRepository";
import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementModel } from "../persistence/models/AdvertisementModel";
import { AdvertisementDTO } from "../../usecases/dtos/AdvertisementDTO";
import { SortOrder } from "../../../types/express/index";

export class AdvertisementRepository implements IAdvertisementRepository {
  async findAll<T>( 
      query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0
    ): Promise< {advertisements: AdvertisementDTO[], total: number} | null> {
    try {
      const adDoc = await AdvertisementModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit);

      if (!adDoc) {
        return null;
      }
      const ad = adDoc.map(
        (ad) =>
          new Advertisement(
            ad.id,
            ad.title,
            ad.subtitle,
            ad.content,
            ad.image,
            ad.isListed,
            new Date(ad.createdAt).toLocaleDateString()
          )
      );

      const total = await AdvertisementModel.countDocuments(query);
      return { advertisements: ad, total: total };
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  }

  async findById(advertisementId: string): Promise<AdvertisementDTO | null> {
    try {
      const adDoc = await AdvertisementModel.findById(advertisementId);

      return adDoc
        ? {
            id: adDoc.id,
            title: adDoc.title,
            subtitle: adDoc.subtitle,
            content: adDoc.content,
            image: adDoc.image,
            isListed: adDoc.isListed,
            createdAt: adDoc.createdAt,
          }
        : null;
    } catch (error) {
      throw new Error("something happend findById");
    }
  }

  async create(advertisementData: AdvertisementDTO): Promise<boolean> {
    try {
      const newAdvertisement = new AdvertisementModel({
        title: advertisementData.title,
        subtitle: advertisementData.subtitle,
        content: advertisementData.content,
        image: advertisementData.image,
        isListed: true,
      });

      await newAdvertisement.save();
      return true;
    } catch (error) {
      throw new Error("something happend in create");
    }
  }

  async update(advertisementData: AdvertisementDTO): Promise<boolean> {
    try {
      const adDoc = await AdvertisementModel.findByIdAndUpdate(
        advertisementData.id,
        {
          title: advertisementData.title,
          subtitle: advertisementData.subtitle,
          content: advertisementData.content,
          isListed: advertisementData.isListed,
        },
        { new: true }
      );
      return adDoc !== null;
    } catch (error) {
      throw new Error("something happend in update");
    }
  }

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
  }

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
  }
}
