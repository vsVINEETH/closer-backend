import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementDTO } from "../../usecases/dtos/AdvertisementDTO";

export function toAdvertisementDTO(entity: Advertisement): AdvertisementDTO {
    return {
        id: entity.id,
        title: entity.title,
        subtitle: entity.subtitle,
        content: entity.content,
        image: entity.image,
        isListed: entity.isListed,
        createdAt: entity.createdAt
    };
};

