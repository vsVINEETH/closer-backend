import { IContentDocument } from "../persistence/interfaces/IContentModel";

export type ContentPersistanceType = Pick<IContentDocument, 'title' | 'subtitle'|'content'|'image'|'category' >

export type ContentUpdateType = Pick<IContentDocument, 'id'|'title' | 'subtitle'|'content'|'isListed'|'category' >