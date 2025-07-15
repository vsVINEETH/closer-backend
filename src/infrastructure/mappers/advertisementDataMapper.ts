import { AdvertisementDocument } from "../persistence/interfaces/IAdvertisement";
import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementDTO } from "../../usecases/dtos/AdvertisementDTO";
import { AdvertisementPersistenceType, AdvertisementUpdateType } from "../types/AdvertisementType";

export function toAdvertisementEntityFromDoc(doc: AdvertisementDocument): Advertisement {
  return new Advertisement({
    id: doc.id.toString(),
    title: doc.title,
    subtitle: doc.subtitle,
    content: doc.content,
    image: doc.image,
    isListed: doc.isListed,
    createdAt: doc.createdAt
  });
};

export function toAdvertisementEntitiesFromDoc(doc: AdvertisementDocument[]): Advertisement[] {
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
    ))
};

export function toAdvertisementPersistance(advertisement: AdvertisementDTO): AdvertisementPersistenceType {
      return {
        title: advertisement.title,
        subtitle: advertisement.subtitle,
        content: advertisement.content,
        image: advertisement.image,
     };
};

export function toAdvertisementUpdate(advertisement: AdvertisementDTO): AdvertisementUpdateType {
    return {
        title: advertisement.title,
        subtitle: advertisement.subtitle,
        content: advertisement.content,
        isListed: advertisement.isListed ?? false
    };
};