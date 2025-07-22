import { IEventDocument } from "../persistence/interfaces/IEventModel";

export type EventPersistanceType = Pick<IEventDocument, 'title'| 'description'| 'image'| 'location'| 
                                                        'locationURL'| 'eventDate'| 'slots'| 'price'>

export type EventUpdateType = Pick<IEventDocument, 'title'| 'description'| 'location'| 
                                                        'locationURL'| 'eventDate'| 'slots'| 'price'>
                                                        