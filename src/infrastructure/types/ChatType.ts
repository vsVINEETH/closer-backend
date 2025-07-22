import { IChatDocument } from "../persistence/interfaces/IChatModel";

export type ChatPersistanceType = Pick<IChatDocument, 'sender'| 'receiver'| 'message'| 'type' >

const validTypes = ['text', 'image', 'audio', 'call'] as const;

export type ChatType = typeof validTypes[number];