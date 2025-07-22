import { IAdvertisementRepository } from "../../domain/repositories/IAdvertisementRepository";
import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementModel } from "../persistence/models/AdvertisementModel";
import { SortOrder } from "../../../types/express/index";
import { toAdvertisementEntityFromDoc, toAdvertisementEntitiesFromDoc } from "../mappers/advertisementDataMapper";
import { AdvertisementUpdateType } from "../types/AdvertisementType";
import { BaseRepository } from "./BaseRepository";
import { IAdvertisementDocument } from "../persistence/interfaces/IAdvertisement";

export class AdvertisementRepository extends BaseRepository<Advertisement, IAdvertisementDocument> implements IAdvertisementRepository {
  constructor() {
    super(AdvertisementModel, toAdvertisementEntityFromDoc, toAdvertisementEntitiesFromDoc);
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
    };
  };
  
};
