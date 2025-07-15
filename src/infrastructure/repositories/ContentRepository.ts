import { IContentRepository } from "../../domain/repositories/IContentRepository";
import { Content } from "../../domain/entities/Content";
import { ContentModel } from "../persistence/models/ContentModel";
import { PopularCategory, TrendingContent } from "../../usecases/dtos/ContentDTO";
import { SortOrder } from "../config/database";
import { Filter } from "../../../types/express";
import { UpdateQuery } from "mongoose";

import { toContentEnitiesFromDocs, toContentEnityFromDoc } from "../mappers/contentDataMapper";
import { ContentPersistanceType, ContentUpdateType } from "../types/ContentType";
import { FilterMatchType, SharesUpdateOptions, VoteUpdateOptions } from "../../usecases/types/ContentTypes";
import { TotalContent, MostLiked, MostShared, RecentContent } from "../../usecases/dtos/ContentDTO";
export class ContentRepository implements IContentRepository {
   async findAll<T>(
      query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0
    ): Promise< Content[] | null> {
    try {
      const contentDocs = await ContentModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("category").exec();

      return contentDocs ? toContentEnitiesFromDocs(contentDocs) : null;
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  };

  async countDocs<T>(query: Record<string, T> = {}): Promise<number> {
    try {
      const totalDocs = await ContentModel.countDocuments(query);
      return totalDocs;
    } catch (error) {
      throw new Error("something happend in countDocs");
    }
  };

  async findById(contentId: string): Promise<Content | null> {
    try {
      const content = await ContentModel.findById(contentId);
      return content ? toContentEnityFromDoc(content) : null;
    } catch (error) {
      throw new Error("something happend in findById");
    }
  }

  async create(contentData: ContentPersistanceType): Promise<boolean> {
    try {
      const newContent = new ContentModel(contentData);
      await newContent.save();
      return true;
    } catch (error) {
      throw new Error("something happend in create");
    }
  }

  async update(updatedContedData: ContentUpdateType): Promise<boolean> {
    try {// might be small issue is due to id insertion
      const content = await ContentModel.findByIdAndUpdate(
        updatedContedData.id,
        updatedContedData,
        { new: true }
      );
      return content !== null;
    } catch (error) {
      throw new Error("something happend in update");
    }
  }

  async listById(contentId: string, status: boolean): Promise<boolean | null> {
    try {
      const content = await ContentModel.findByIdAndUpdate(
        contentId,
        {
          isListed: status,
        },
        { new: true }
      );

      return content !== null;
    } catch (error) {
      throw new Error("something happend in listById");
    }
  };

  async deleteById(contentId: string): Promise<boolean | null> {
    try {
      const content = await ContentModel.findByIdAndDelete(contentId, { new: true });
      return content !== null;
    } catch (error) {
      throw new Error("something happend in deleteById");
    };
  };


  async voteById(blogId: string, options: VoteUpdateOptions): Promise<boolean | null> {
    try {

      const updateQuery: UpdateQuery<{ upvotes?: string[]; downvotes?: string[] }> = {};

      if (options.addToSet) updateQuery.$addToSet = options.addToSet;
      if (options.pull) updateQuery.$pull = options.pull;

      const content  = await ContentModel.findByIdAndUpdate(
        blogId,
        updateQuery,
        { new: true } 
      );
  
      return content !== null;
    } catch (error) {
      throw new Error('Something happened in voteById');
    }
  };

  async shareById(blogId: string, options: SharesUpdateOptions): Promise< boolean | null> {
    try {

      const updateQuery: UpdateQuery<{ shares?: string[] }> = {};
     
      if(options.addToSet) updateQuery.$addToSet = options.addToSet;

      const content = await ContentModel.findByIdAndUpdate(
        blogId,
        updateQuery,
        {new: true}
      );

      return content !== null;
    } catch (error) {
      throw new Error('Something happend in shareById')
    }
  };

  async getTotalContent(filterConstraints: FilterMatchType): Promise< TotalContent[] |null> {
    try {
      const contents = await ContentModel.find(filterConstraints);
      return contents ? toContentEnitiesFromDocs(contents) : null;
    } catch (error) {
      throw new Error('Something happend in getTotalContent') 
    };
  };

  
  async getMostLikedContents(filterConstraints: FilterMatchType): Promise< MostLiked[] |null> {
    try {
     const contents = await  ContentModel.aggregate([
          { $match: filterConstraints },
          {
            $project: {
              title: 1,
              subtitle: 1,
              content: 1,
              image: 1,
              upvotesCount: { $size: { $ifNull: ["$upvotes", []] } },
              createdAt: 1,
            },
          },
          { $sort: { upvotesCount: -1 } },
          { $limit: 10 },
        ]);

        return contents ? contents : null;      
    } catch (error) {
      throw new Error('Something happend in getTotalContent') 
    }
  };

  async getMostSharedContent(filterConstraints: FilterMatchType): Promise< MostShared[] |null>{
    try {
        
     const contents = await ContentModel.aggregate([
          { $match: filterConstraints },
          {
            $project: {
              title: 1,
              subtitle: 1,
              content: 1,
              image: 1,
              sharesCount: { $size: { $ifNull: ["$shares", []] } },
              createdAt: 1,
            },
          },
          { $sort: { sharesCount: -1 } },
          { $limit: 10 },
        ]);

        return contents ? contents : null;
    } catch (error) {
      throw new Error('Something happend in getMostSharedContent') 
    }
  };

  async getRecentContent(filterConstraints: FilterMatchType): Promise< RecentContent[]|null>{
    try {
      const contents = await ContentModel.aggregate([
          { $match: filterConstraints },
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
        ]);
      return contents ? contents : null;
    } catch (error) {
      throw new Error('Something happend in getRecentContent') 
    }
  };

  
  async getTrendingContents(filterConstraints: FilterMatchType, dateThreshold: Date, endDate: Date): Promise< TrendingContent[] |null>{
    try {
      const contents = await ContentModel.aggregate([
          {
            $match: {
              createdAt: { $gte: dateThreshold, $lte: endDate },
              ...filterConstraints,
            },
          },
          {
            $project: {
              title: 1,
              subtitle: 1,
              content: 1,
              image: 1,
              interactionsCount: {
                $add: [
                  { $size: { $ifNull: ["$upvotes", []] } },
                  { $size: { $ifNull: ["$downvotes", []] } },
                  { $size: { $ifNull: ["$shares", []] } },
                ],
              },
              createdAt: 1,
            },
          },
          { $sort: { interactionsCount: -1 } },
          { $limit: 10 },
        ]);
        //console.log(contents)
        return contents ? contents : null;
    } catch (error) {
      throw new Error('Something happend in getTrendingContents') 
    }
  };

   async getPopularCategory(filterConstraints: FilterMatchType, dateThreshold: Date, endDate: Date): Promise< PopularCategory[] |null>{
    try {
      const contents = await ContentModel.aggregate([
          {
            $match: {
              createdAt: { $gte: dateThreshold, $lte: endDate },
              ...filterConstraints,
            },
          },
          {
            $lookup: {
              from: "categories",
              localField: "category",
              foreignField: "_id",
              as: "categoryData",
            },
          },
          { $unwind: "$categoryData" },
          {
            $project: {
              category: "$categoryData.name",
              interactionsCount: {
                $add: [
                  { $size: { $ifNull: ["$upvotes", []] } },
                  { $size: { $ifNull: ["$downvotes", []] } },
                  { $size: { $ifNull: ["$shares", []] } },
                ],
              },
            },
          },
          {
            $group: {
              _id: "$category",
              totalInteractions: { $sum: "$interactionsCount" },
            },
          },
          { $sort: { totalInteractions: -1 } },
          { $limit: 1 },
        ]);
     
        return contents ? contents : null;
    } catch (error) {
      throw new Error('Something happend in getPopularCategory') 
    }
  };

  // async getAggregatedData(filterConstraints: FilterMatchType, dateThreshold: Date, endDate: Date): Promise< DashboardData | null> {
  //   try {
      
  //     const [
  //       totalContent,
  //       mostLiked,
  //       mostShared,
  //       recentContent,
  //       trendingContents,
  //       popularCategory
  //     ] = await Promise.all([
  
  //       ContentModel.find(filterConstraints),
  
  //       ContentModel.aggregate([
  //         { $match: filterConstraints },
  //         {
  //           $project: {
  //             title: 1,
  //             subtitle: 1,
  //             content: 1,
  //             image: 1,
  //             upvotesCount: { $size: { $ifNull: ["$upvotes", []] } },
  //             createdAt: 1,
  //           },
  //         },
  //         { $sort: { upvotesCount: -1 } },
  //         { $limit: 10 },
  //       ]),
  
  //       ContentModel.aggregate([
  //         { $match: filterConstraints },
  //         {
  //           $project: {
  //             title: 1,
  //             subtitle: 1,
  //             content: 1,
  //             image: 1,
  //             sharesCount: { $size: { $ifNull: ["$shares", []] } },
  //             createdAt: 1,
  //           },
  //         },
  //         { $sort: { sharesCount: -1 } },
  //         { $limit: 10 },
  //       ]),
  
  //       ContentModel.aggregate([
  //         { $match: filterConstraints },
  //         { $sort: { createdAt: -1 } },
  //         { $limit: 10 },
  //       ]),
  
  //       ContentModel.aggregate([
  //         {
  //           $match: {
  //             createdAt: { $gte: dateThreshold, $lte: endDate },
  //             ...filterConstraints,
  //           },
  //         },
  //         {
  //           $project: {
  //             title: 1,
  //             subtitle: 1,
  //             content: 1,
  //             image: 1,
  //             interactionsCount: {
  //               $add: [
  //                 { $size: { $ifNull: ["$upvotes", []] } },
  //                 { $size: { $ifNull: ["$downvotes", []] } },
  //                 { $size: { $ifNull: ["$shares", []] } },
  //               ],
  //             },
  //             createdAt: 1,
  //           },
  //         },
  //         { $sort: { interactionsCount: -1 } },
  //         { $limit: 10 },
  //       ]),
  
  //       ContentModel.aggregate([
  //         {
  //           $match: {
  //             createdAt: { $gte: dateThreshold, $lte: endDate },
  //             ...filterConstraints,
  //           },
  //         },
  //         {
  //           $lookup: {
  //             from: "categories",
  //             localField: "category",
  //             foreignField: "_id",
  //             as: "categoryData",
  //           },
  //         },
  //         { $unwind: "$categoryData" },
  //         {
  //           $project: {
  //             category: "$categoryData.name",
  //             interactionsCount: {
  //               $add: [
  //                 { $size: { $ifNull: ["$upvotes", []] } },
  //                 { $size: { $ifNull: ["$downvotes", []] } },
  //                 { $size: { $ifNull: ["$shares", []] } },
  //               ],
  //             },
  //           },
  //         },
  //         {
  //           $group: {
  //             _id: "$category",
  //             totalInteractions: { $sum: "$interactionsCount" },
  //           },
  //         },
  //         { $sort: { totalInteractions: -1 } },
  //         { $limit: 1 },
  //       ]),
  //     ]);
  
  //     return {
  //       totalContent  ,
  //       mostLiked,
  //       mostShared,
  //       recentContent,
  //       trendingContents,
  //       popularCategory,
  //     } as unknown as DashboardData;
  //   } catch (error) {
  //     throw new Error("Something happened in getAggregatedData: ");
  //   }
  // };
  
};
