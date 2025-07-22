import { Request } from "express";
import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementDTO } from "../../usecases/dtos/AdvertisementDTO";
import { AdvertisementPersistenceType } from "../../infrastructure/types/AdvertisementType";
import { paramsNormalizer } from "../utils/filterNormalizer";

export function toAdvertisementDTO(entity: Advertisement): AdvertisementDTO {
    try {
        return {
            id: entity.id,
            title: entity.title,
            subtitle: entity.subtitle,
            content: entity.content,
            image: entity.image,
            isListed: entity.isListed,
            createdAt: entity.createdAt
        };   
    } catch (error) {
       throw new Error('Something happend in toAdvertisementDTO')   
    };
};

export function toAdvertisementDTOs(entities: Advertisement[] | null): AdvertisementDTO[] | null {
    try {
        
        return entities ? entities.map((entity) => (
            {
            id: entity.id,
            title: entity.title,
            subtitle: entity.subtitle,
            content: entity.content,
            image: entity.image,
            isListed: entity.isListed,
            createdAt: entity.createdAt
         }
        )): null 
    } catch (error) {
       throw new Error('Something happend in toAdvertisementDTO')   
    };
};


export async function mapVisibilityAdvertisementRequest(req: Request){
    try {
        return {
            advertisementId: req.body.id,
            filterOptions: await paramsNormalizer(req.query)
        };   
    } catch (error) {
      throw new Error('Something happened in toAdvertisementDTOFromRequest')  
    };
};

