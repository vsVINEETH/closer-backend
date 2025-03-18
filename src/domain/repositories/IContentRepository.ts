import { Content } from "../entities/Content";
import { ContentDTO, DashboardData } from "../../usecases/dtos/ContentDTO";
import { SortOrder } from "../../infrastructure/config/database";
import { Filter } from "../../../types/express/index";
export interface IContentRepository {
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<{contents:Content[], total: number} | null>;
    findById(contentId: string): Promise<ContentDTO | null>;
    create(contentData: ContentDTO): Promise<boolean>;
    update(updateContentData: ContentDTO): Promise<boolean>
    listById(contentId: string, status: boolean): Promise<boolean | null>
    deleteById(contentId: string): Promise<boolean | null>
    voteById(userId: string, blogId: string, voteType: string): Promise<boolean | null>
    shareById(userId: string, blogId: string): Promise< boolean | null>
    getAggregatedData(filterConstraints: Filter) : Promise<DashboardData | null>
}