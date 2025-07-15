import { Content } from "../entities/Content";
import { DashboardData } from "../../usecases/dtos/ContentDTO";
import { SortOrder } from "../../infrastructure/config/database";
import { Filter } from "../../../types/express/index";
import { ContentPersistanceType, ContentUpdateType } from "../../infrastructure/types/ContentType";
import { VoteUpdateOptions, SharesUpdateOptions, FilterMatchType } from "../../usecases/types/ContentTypes";
import { TotalContent, MostLiked, MostShared, RecentContent, TrendingContent, PopularCategory } from "../../usecases/dtos/ContentDTO";
export interface IContentRepository {
    findAll<T>(query?: Record<string, T>, sort?:{ [key: string]: SortOrder } , skip?: number, limit?: number): Promise<Content[]| null>;
    findById(contentId: string): Promise<Content | null>;

    countDocs<T>(query: Record<string, T> ): Promise<number>;
    
    create(contentData: ContentPersistanceType): Promise<boolean>;
    update(updateContentData: ContentUpdateType): Promise<boolean>;

    listById(contentId: string, status: boolean): Promise<boolean | null>
    deleteById(contentId: string): Promise<boolean | null>
    voteById(blogId: string, options: VoteUpdateOptions): Promise<boolean | null>
    shareById(blogId: string, options:SharesUpdateOptions): Promise< boolean | null>
    // getAggregatedData(filterConstraints: FilterMatchType, dateThreshold: Date, endDate: Date) : Promise<DashboardData | null>
    getTotalContent(filterConstraints: FilterMatchType): Promise< TotalContent[] |null>
    getMostLikedContents(filterConstraints: FilterMatchType): Promise< MostLiked[] |null>
    getMostSharedContent(filterConstraints: FilterMatchType): Promise< MostShared[] |null>
    getRecentContent(filterConstraints: FilterMatchType): Promise< RecentContent[] |null>
    getTrendingContents(filterConstraints: FilterMatchType, dateThreshold: Date, endDate: Date): Promise< TrendingContent[] |null>
    getPopularCategory(filterConstraints: FilterMatchType, dateThreshold: Date, endDate: Date): Promise< PopularCategory[] |null>
}