import { IContentRepository } from "../../../domain/repositories/IContentRepository";
import { Content } from "../../../domain/entities/Content";
import { ContentDTO, DashboardData, EmployeeDashboardDTO, Filter } from "../../dtos/ContentDTO";
import { IMailer } from "../../interfaces/IMailer";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { paramToQueryContent } from "../../../interfaces/utils/paramToQuery";
import { IS3Client } from "../../interfaces/IS3Client";
import { toContentPersistance, toContentUpdate } from "../../../infrastructure/mappers/contentDataMapper";
import { mapDashboardData } from "../../../interfaces/mappers/contentDTOMapper";
import { VoteUpdateOptions, SharesUpdateOptions, FilterMatchType } from "../../types/ContentTypes";
export class ContentManagement {
    constructor(
        private _contentRepository: IContentRepository,
        private _userRepository: IUserRepository,
        private _mailer: IMailer,
        private _s3: IS3Client
    ) { };


    private async _fetchAndEnrich(query: SearchFilterSortParams): Promise<{contents:Content[], total: number}> {
        try {
            const queryResult = await paramToQueryContent(query);
            const total = await this._contentRepository.countDocs(queryResult.query);
            const contents = await this._contentRepository.findAll(
                queryResult.query,
                queryResult.sort,
                queryResult.skip,
                queryResult.limit
            );

            if (contents) {
                await Promise.all(
                contents.map(async (doc) => {
                    doc.image = await Promise.all(
                    doc.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
                    );
                })
                );
            };
            return { contents: contents ?? [], total: total ?? 0 };  
        } catch (error) {
            throw new Error('Something happend fetchAndEnrich')
        };
    };


    private async _notifyUsers(contentData: ContentDTO): Promise<void> {
        try {
            const users = await this._userRepository.findAll();
            if (!users) {
                return;
            }

            const htmlContent = this._mailer.generateNewContentNotifyEmail(contentData);
            users.users.forEach(async (user) => {
                try {
                    await this._mailer.SendEmail(
                        user.email,
                        `New Content${contentData.title}`,
                        htmlContent
                    );
                    return
                } catch (error) {
                    console.error(`Failed to send email to ${user.email}:`, error);
                }
            });

            return;
        } catch (error) {
            throw new Error("something happend in notifyUsers");
        }
    }

    async createContent(contentData: ContentDTO, query: SearchFilterSortParams, imageFiles: Express.Multer.File[]): Promise<{contents:Content[], total: number}  | null> {
        try {
            const image: string[] = [];
            for(let post of imageFiles){
               const fileName = await this._s3.uploadToS3(post);
               image.push(fileName);
            };

            const dataToPersist = toContentPersistance({...contentData, image});
            const result = await this._contentRepository.create(dataToPersist);
            
            if (result) {
                this._notifyUsers(contentData);
                const contents = await this._fetchAndEnrich(query);
                return contents ?? null;
            }
            return null;
        } catch (error) {
            throw new Error("something happend in createContent");
        }
    }

    async fetchContentData(options: SearchFilterSortParams): Promise<{contents:Content[], total: number} | null> {
        try {

            const contents = await this._fetchAndEnrich(options);
            return contents ?? null;
        } catch (error) {
            throw new Error("something happend in fetchContentData");
        }
    }

    async updateContent(updatedContentData: ContentDTO, query: SearchFilterSortParams): Promise<{contents:Content[], total: number} | null> {
        try {

            const dataToUpdate = toContentUpdate(updatedContentData)
            const result = await this._contentRepository.update(dataToUpdate);
           
            if (result) {
                const contents = await this._fetchAndEnrich(query);
                return contents ?? null;
            };
            return null;
        } catch (error) {
            throw new Error("something happend in updateContent");
        };
    };

    async handleListing(contentId: string, query: SearchFilterSortParams): Promise<{contents:Content[], total: number}  | null> {
        try {
            const content = await this._contentRepository.findById(contentId);

            if (content) {
                const status: boolean = !content.isListed;
                const result = await this._contentRepository.listById(contentId, status);
                
                if(!result) return null;

                const contents = await this._fetchAndEnrich(query);
                return contents ?? null;
            };

            return null;
        } catch (error) {
            throw new Error("something happend in hadleListing");
        };
    };

    async deleteContent(contentId: string, query: SearchFilterSortParams): Promise<{contents:Content[], total: number}  | null> {
        try {
            const contentDetail = await this._contentRepository.findById(contentId)
           
            if (contentDetail) {
                await Promise.all(
                    contentDetail.image.map(async (val) => await this._s3.deleteFromS3(val as string))
                );
                contentDetail.image = [];
            };

            const updatedContent = await this._contentRepository.deleteById(contentId);
            
            if (updatedContent) {
                const contents = await this._fetchAndEnrich(query);
                return contents ?? null;
            };

            return null;
        } catch (error) {
            throw new Error("something happend in deleteContent");
        }
    }

    async contentDetail(contentId: string): Promise<ContentDTO | null> {
        try {
       
            const content = await this._contentRepository.findById(contentId);
            if(content){
             content.image = await Promise.all(
                content.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
            );
          }
          return content;
        } catch (error) {
           throw new Error('something happend in contentDetail') 
        }
    }

    async voteContent(userId: string, blogId: string, voteType: string): Promise<ContentDTO | null> {
        try {
            const content = await this._contentRepository.findById(blogId);
            if(!content) return null;

            let updateOptions: VoteUpdateOptions = {};

            if(voteType === 'upvote'){
                if (content.upvotes.includes(userId)) {
                    updateOptions.pull = { upvotes: userId };
                } else {
                    updateOptions.addToSet = { upvotes: userId };
                    updateOptions.pull = { downvotes: userId };
                };
            }else if (voteType === 'downvote'){
                if (content.downvotes.includes(userId)) {
                    updateOptions.pull = { downvotes: userId };
                } else {
                    updateOptions.addToSet = { downvotes: userId };
                    updateOptions.pull = { upvotes: userId };
                };
            };

            const result = await this._contentRepository.voteById(blogId, updateOptions);
            if(!result) return null;
            
            if(content){
                content.image = await Promise.all(
                   content.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
               );
            };

            return content;
        } catch (error) {
            throw new Error('something happend in voteContent')
        }
     };


     async sharedContent(userId: string, blogId: string): Promise<ContentDTO | null> {
        try {

            const content = await this._contentRepository.findById(blogId);

            let updateOptions: SharesUpdateOptions = {};

            if(!content?.shares.includes(userId)){
                updateOptions.addToSet = {shares: userId}
            };

            const result = await this._contentRepository.shareById(blogId, updateOptions);
            if(!result) return null;
            
            if(content){
                content.image = await Promise.all(
                   content.image.map(async (val) => await this._s3.retrieveFromS3(val as string))
               );
             }
            return content;
        } catch (error) {
            throw new Error('something happend in sharedContent')
        }
     };


    async getDashboardData(filterConstraints: Filter): Promise<EmployeeDashboardDTO | null> {
        try {

            const startOfYear = new Date(new Date('2024').getFullYear(), 0, 1); 
            const startDate = filterConstraints.startDate ? new Date(filterConstraints.startDate) : startOfYear;
            const endDate = filterConstraints.endDate ? new Date(filterConstraints.endDate) : new Date();
            
            const dateThreshold = new Date();
            dateThreshold.setDate(dateThreshold.getDate() - 7); 

            const filterMatch: FilterMatchType = {};

            if (startDate && endDate) {
                filterMatch.createdAt = { $gte: startDate, $lte: endDate };
            };

            const [
                totalContent,
                mostLiked,
                mostShared,
                recentContent,
                trendingContent,
                popularCategory
            ] = await Promise.all([
                this._contentRepository.getTotalContent(filterMatch),
                this._contentRepository.getMostLikedContents(filterMatch),
                this._contentRepository.getMostSharedContent(filterMatch),
                this._contentRepository.getRecentContent(filterMatch),
                this._contentRepository.getTrendingContents(filterMatch, dateThreshold, endDate),
                this._contentRepository.getPopularCategory(filterMatch, dateThreshold, endDate)
            ]);

            const dashboardData = mapDashboardData(
                totalContent ?? [],
                mostLiked ?? [],
                mostShared ?? [],
                recentContent ?? [],
                trendingContent ?? [],
                popularCategory ?? [],
            );
            return dashboardData;
        } catch (error) {
           throw new Error('something happend in getDashboardData') 
        };
    };
};
