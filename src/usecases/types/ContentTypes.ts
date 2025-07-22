import { Content } from "../../domain/entities/Content";
import { ContentDTO } from "../dtos/ContentDTO";

export type VoteUpdateOptions = {
  addToSet?: Record<string, string>;
  pull?: Record<string, string>;
};

export type SharesUpdateOptions = {
    addToSet?: Record<string, string>
}

export type FilterMatchType = {
    createdAt?: { $gte: Date; $lte: Date };
    status?: string;
    category?: string;
};


export type ContentUseCaseResponse = {contents:ContentDTO[], total: number} 