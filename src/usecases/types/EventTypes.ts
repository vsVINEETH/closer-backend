import { Event } from "../../domain/entities/Event";
import { EventListingDTO } from "../dtos/EventDTO";

export type EventUseCaseResponse = { events: EventListingDTO[]; total: number };
