import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { ContentDTO, EmployeeDashboardDTO, Filter } from "../../dtos/ContentDTO";
import { ContentUseCaseResponse } from "../../types/ContentTypes";

export interface IContentUseCase {
    createContent(contentData: ContentDTO, query: SearchFilterSortParams, imageFiles: Express.Multer.File[]): Promise<ContentUseCaseResponse| null>
    fetchContentData(options: SearchFilterSortParams): Promise<ContentUseCaseResponse| null>
    updateContent(updatedContentData: ContentDTO, query: SearchFilterSortParams): Promise<ContentUseCaseResponse| null>
    handleListing(contentId: string, query: SearchFilterSortParams): Promise<ContentUseCaseResponse | null>
    deleteContent(contentId: string, query: SearchFilterSortParams): Promise<ContentUseCaseResponse| null>
    contentDetail(contentId: string): Promise<ContentDTO | null>;
    voteContent(userId: string, blogId: string, voteType: string): Promise<ContentDTO | null>;
    sharedContent(userId: string, blogId: string): Promise<ContentDTO | null>;
    getDashboardData(filterConstraints: Filter): Promise<EmployeeDashboardDTO | null>
}