import { ContentDocument } from "../persistence/interfaces/IContentModel";

export type ContentPersistanceType = Pick<ContentDocument, 'title' | 'subtitle'|'content'|'image'|'category' >

export type ContentUpdateType = Pick<ContentDocument, 'id'|'title' | 'subtitle'|'content'|'isListed'|'category' >