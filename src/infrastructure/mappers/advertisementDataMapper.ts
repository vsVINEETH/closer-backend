import { IAdvertisementDocument } from "../persistence/interfaces/IAdvertisement";
import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementDTO } from "../../usecases/dtos/AdvertisementDTO";
import { AdvertisementPersistenceType, AdvertisementUpdateType } from "../types/AdvertisementType";

export function toAdvertisementEntityFromDoc(doc: IAdvertisementDocument): Advertisement {
  try {
    return new Advertisement({
      id: doc.id.toString(),
      title: doc.title,
      subtitle: doc.subtitle,
      content: doc.content,
      image: doc.image,
      isListed: doc.isListed,
      createdAt: doc.createdAt
    });
  } catch (error) {
    throw new Error('Something happend in toAdvertisementEntityFromDoc')
  };
};

export function toAdvertisementEntitiesFromDoc(doc: IAdvertisementDocument[]): Advertisement[] {
  try {
     return doc.map((d) => (
        new Advertisement({
            id: d.id.toString(),
            title: d.title,
            subtitle: d.subtitle,
            content: d.content,
            image: d.image,
            isListed: d.isListed,
            createdAt: d.createdAt
        })
    ));
  } catch (error) {
    throw new Error('Something happend in toAdvertisementEntitiesFromDoc')
  };
};

export function toAdvertisementPersistance(advertisement: AdvertisementDTO): AdvertisementPersistenceType {
  try {
      return {
        title: advertisement.title,
        subtitle: advertisement.subtitle,
        content: advertisement.content,
        image: advertisement.image,
     }; 
  } catch (error) {
    throw new Error('Something happend in toAdvertisementPersistance')
  };
};

export function toAdvertisementUpdate(advertisement: AdvertisementDTO): AdvertisementUpdateType {
  try {
     return {
        title: advertisement.title,
        subtitle: advertisement.subtitle,
        content: advertisement.content,
        isListed: advertisement.isListed ?? false
     };
  } catch (error) {
    throw new Error('Something happend in toAdvertisementUpdate')
  };
};