import { IContentRepository } from "../../../domain/repositories/IContentRepository";
import { Content } from "../../../domain/entities/Content";
import { ContentDTO, DashboardData, FetchParams, Filter } from "../../dtos/ContentDTO";
import { IMailer } from "../../interfaces/IMailer";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { ClientQuery } from "../../../../types/express";
import { paramToQueryContent } from "../../../interfaces/utils/paramToQuery";
import { IS3Client } from "../../interfaces/IS3Client";
export class ContentManagement {
    constructor(
        private contentRepository: IContentRepository,
        private userRepository: IUserRepository,
        private mailer: IMailer,
        private s3: IS3Client
    ) { }

    private async notifyUsers(contentData: ContentDTO): Promise<void> {
        try {
            const users = await this.userRepository.findAll();
            if (!users) {
                return;
            }

            const htmlContent = this.mailer.generateNewContentNotifyEmail(contentData);
            users.users.forEach(async (user) => {
                try {
                    await this.mailer.SendEmail(
                        user.email,
                        `New Content${contentData.title}`,
                        htmlContent
                    );
                } catch (error) {
                    console.error(`Failed to send email to ${user.email}:`, error);
                }
            });
        } catch (error) {
            throw new Error("something happend in notifyUsers");
        }
    }

    async createContent(contentData: ContentDTO, query: SearchFilterSortParams, imageFiles: Express.Multer.File[]): Promise<{contents:Content[], total: number}  | null> {
        try {
            const image: string[] = [];
            for(let post of imageFiles){
               const fileName = await this.s3.uploadToS3(post);
               image.push(fileName);
            };

            const result = await this.contentRepository.create({...contentData, image});
            if (result) {
                this.notifyUsers(contentData);
                const queryResult = await paramToQueryContent(query);
                const updatedContents = await this.contentRepository.findAll(
                   queryResult.query,
                   queryResult.sort,
                   queryResult.skip,
                   queryResult.limit
               );

               if (updatedContents?.contents) {
                    await Promise.all(
                        updatedContents.contents.map(async (doc) => {
                            doc.image = await Promise.all(
                                doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                            );
                        })
                    );
                };
            
               return updatedContents ? {contents: updatedContents.contents, total: updatedContents.total} : null;
            }
            return null;
        } catch (error) {
            throw new Error("something happend in createContent");
        }
    }

    async fetchContentData(options: SearchFilterSortParams): Promise<{contents:Content[], total: number} | null> {
        try {

            let contentData;
            if(options){
                const queryResult = await paramToQueryContent(options)
                 contentData = await this.contentRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );
            } else {
               contentData = await this.contentRepository.findAll();
            }

            
            if (contentData?.contents) {
                await Promise.all(
                    contentData.contents.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };

            return contentData ? {contents: contentData.contents, total: contentData.total} : null;
        } catch (error) {
            throw new Error("something happend in fetchContentData");
        }
    }

    async getDashboardData(filterConstraints: Filter): Promise<DashboardData | null> {
        try {
            const result = await this.contentRepository.getAggregatedData(filterConstraints);

            if(!result){return null};
            return result;
        } catch (error) {
            console.log(error)
           throw new Error('something happend in getDashboardData') 
        }
    }

    async updateContent(updatedContentData: ContentDTO, query: SearchFilterSortParams): Promise<{contents:Content[], total: number} | null> {
        try {
            const result = await this.contentRepository.update(updatedContentData);
            if (result) {
                const queryResult = await paramToQueryContent(query)
                const updatedContents = await this.contentRepository.findAll(
                   queryResult.query,
                   queryResult.sort,
                   queryResult.skip,
                   queryResult.limit
               );

               if (updatedContents?.contents) {
                await Promise.all(
                    updatedContents.contents.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };
               return updatedContents ? {contents: updatedContents.contents, total: updatedContents.total} : null;
            }
            return null;
        } catch (error) {
            throw new Error("something happend in updateContent");
        }
    }

    async handleListing(contentId: string, query: SearchFilterSortParams): Promise<{contents:Content[], total: number}  | null> {
        try {
            const content = await this.contentRepository.findById(contentId);

            if (content) {
                const status: boolean = !content.isListed;

                const result = await this.contentRepository.listById(contentId, status);
                if(!result) return null;
                const queryResult = await paramToQueryContent(query)
                const updatedContents = await this.contentRepository.findAll(
                   queryResult.query,
                   queryResult.sort,
                   queryResult.skip,
                   queryResult.limit
               );

               if (updatedContents?.contents) {
                await Promise.all(
                    updatedContents.contents.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };
               return updatedContents ? {contents: updatedContents.contents, total: updatedContents.total} : null;
            }

            return null;
        } catch (error) {
            throw new Error("something happend in hadleListing");
        }
    }

    async deleteContent(contentId: string, query: SearchFilterSortParams): Promise<{contents:Content[], total: number}  | null> {
        try {
            const contentDetail = await this.contentRepository.findById(contentId)
           
            if (contentDetail) {
                await Promise.all(
                    contentDetail.image.map(async (val) => await this.s3.deleteFromS3(val as string))
                );
                contentDetail.image = [];
            };

            const content = await this.contentRepository.deleteById(contentId);
            if (content) {
                const queryResult = await paramToQueryContent(query)
                const updatedContents = await this.contentRepository.findAll(
                   queryResult.query,
                   queryResult.sort,
                   queryResult.skip,
                   queryResult.limit
               );
               if (updatedContents?.contents) {
                await Promise.all(
                    updatedContents.contents.map(async (doc) => {
                        doc.image = await Promise.all(
                            doc.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
                        );
                    })
                );
            };
               return updatedContents ? {contents: updatedContents.contents, total: updatedContents.total} : null;
            }
            return null;
        } catch (error) {
            throw new Error("something happend in deleteContent");
        }
    }

    async contentDetail(contentId: string): Promise<ContentDTO | null> {
        try {
       
            const content = await this.contentRepository.findById(contentId);
            if(content){
             content.image = await Promise.all(
                content.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
            );
          }
          return content;
        } catch (error) {
           throw new Error('something happend in contentDetail') 
        }
    }

     async voteContent(userId: string, blogId: string, voteType: string): Promise<ContentDTO | null> {
        try {
            const result = await this.contentRepository.voteById(userId, blogId, voteType);
            if(!result){return null};
            const content = await this.contentRepository.findById(blogId);
            if(content){
                content.image = await Promise.all(
                   content.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
               );
             }
            return content;
        } catch (error) {
            throw new Error('something happend in upvoteContent')
        }
     }


     async sharedContent(userId: string, blogId: string): Promise<ContentDTO | null> {
        try {
            const result = await this.contentRepository.shareById(userId, blogId);
            if(!result){return null};
            const content = await this.contentRepository.findById(blogId);
            if(content){
                content.image = await Promise.all(
                   content.image.map(async (val) => await this.s3.retrieveFromS3(val as string))
               );
             }
            return content;
        } catch (error) {
            throw new Error('something happend in sharedContent')
        }
     }
}
