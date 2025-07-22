import { Advertisement } from "../../domain/entities/Advertisement";
import { AdvertisementDTO } from "../dtos/AdvertisementDTO";
export type AdvertisementUseCaseResponse = { advertisement: AdvertisementDTO[]; total: number };
