// usecases/mappers/AdvertisementMapper.ts
import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementDTO } from "../dtos/AdvertisementDTO";
import { AdvertisementDocument } from "../../infrastructure/persistence/interfaces/IAdvertisement";

export function toEntities(doc: AdvertisementDocument[] | null): Advertisement[] | null {
    try {
      if (!doc) {return null};
      
      const ad = doc.map(
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

      return ad;   
    } catch (error) {
        throw new Error('Something happend in toEntities')
    };

  };

export function toDTOs(ads: Advertisement[]):{ advertisements:Advertisement[]}  {
    try {
       return { advertisements: ads }; 
    } catch (error) {
     throw new Error('Something happend in toDTOs')
    };
 
};

export function toEntity(doc: AdvertisementDocument ): Advertisement | null {
    try {
        if(!doc) return null;
        return new Advertisement(
            doc.id,
            doc.title,
            doc.subtitle,
            doc.content,
            doc.image,
            doc.isListed,
            doc.createdAt,
        );
    } catch (error) {
       throw new Error('Something happend in toEnity');
    };
};

export function toDTO(ads: Advertisement ): AdvertisementDTO {

    try {
        return {
            id: ads.id,
            title: ads.title,
            subtitle: ads.subtitle,
            content: ads.content,
            image: ads.image,
            isListed: ads.isListed,
            createdAt: ads.createdAt,
        };
    } catch (error) {
       throw new Error('Something happend in toDTO') 
    };
};

export function toPersistance(dto: AdvertisementDTO): Partial<AdvertisementDTO> {
    try {
      return {
        title: dto.title,
        subtitle: dto.subtitle,
        content: dto.content,
        image: dto.image,
        isListed: dto?.isListed ?? true,
      };
    } catch (error) {
     throw new Error('Something happend in toPersistance') 
    };
};

export function toUpdate(dto: AdvertisementDTO): Partial<AdvertisementDTO> {
    try {
      return {
        title: dto.title,
        subtitle: dto.subtitle,
        content: dto.content,
        isListed: dto?.isListed ?? true,
      };  
    } catch (error) {
      throw new Error('Something happend in toPersistance') 
    }
};
