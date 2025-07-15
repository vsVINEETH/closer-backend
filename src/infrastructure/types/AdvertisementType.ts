import { AdvertisementDocument } from "../persistence/interfaces/IAdvertisement";

export type AdvertisementPersistenceType = Pick<AdvertisementDocument, "title" | "subtitle" | "content" | "image">;

export type AdvertisementUpdateType = Pick<AdvertisementDocument, "title" | "subtitle" | "content" | "isListed">;
