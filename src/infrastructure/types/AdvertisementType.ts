import { IAdvertisementDocument } from "../persistence/interfaces/IAdvertisement";

export type AdvertisementPersistenceType = Pick<IAdvertisementDocument, "title" | "subtitle" | "content" | "image">;

export type AdvertisementUpdateType = Pick<IAdvertisementDocument, "title" | "subtitle" | "content" | "isListed">;
