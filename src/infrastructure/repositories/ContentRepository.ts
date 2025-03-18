import { IContentRepository } from "../../domain/repositories/IContentRepository";
import { Content } from "../../domain/entities/Content";
import { ContentModel } from "../persistence/models/ContentModel";
import { ContentDTO, DashboardData } from "../../usecases/dtos/ContentDTO";
import { SortOrder } from "../config/database";
import { Filter } from "../../../types/express";
import { UpdateQuery } from "mongoose";

export class ContentRepository implements IContentRepository {
   async findAll<T>(
      query: Record<string, T> = {},
      sort: { [key: string]: SortOrder } = {},
      skip: number = 0,
      limit: number = 0
    ): Promise<{ contents: Content[]; total: number } | null> {
    try {
      const contentDoc = await ContentModel.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("category").exec();

      if (!contentDoc) {
        return null;
      }

      const contents = contentDoc.map(
        (content) =>
          new Content(
            content.id,
            content.title,
            content.subtitle,
            content.content,
            content.image,
            content.isListed,
            new Date(content.createdAt).toLocaleDateString(),
            content.category,
            [],
            [],
            []
          )
      );
      const total = await ContentModel.countDocuments(query)
      return {contents: contents, total: total};
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  }

  async findById(contentId: string): Promise<ContentDTO | null> {
    try {
      const content = await ContentModel.findById(contentId);

      return content
        ? {
            id: content.id,
            title: content.title,
            subtitle: content.subtitle,
            content: content.content,
            image: content.image,
            isListed: content.isListed,
            createdAt: content.createdAt,
            upvotes: content.upvotes,
            downvotes: content.downvotes,
            shares: content.shares
          }
        : null;
    } catch (error) {
      throw new Error("something happend in findById");
    }
  }

  async create(contentData: ContentDTO): Promise<boolean> {
    try {
      const newContent = new ContentModel({
        title: contentData.title,
        subtitle: contentData.subtitle,
        content: contentData.content,
        image: contentData.image,
        isListed: true,
        category: contentData.category,
      });

      await newContent.save();
      return true;
    } catch (error) {
      throw new Error("something happend in create");
    }
  }

  async update(updatedContedData: ContentDTO): Promise<boolean> {
    try {
      const content = await ContentModel.findByIdAndUpdate(
        updatedContedData.id,
        {
          title: updatedContedData.title,
          subtitle: updatedContedData.subtitle,
          content: updatedContedData.content,
          // image: updatedContedData.image,
          isListed: updatedContedData.isListed,
          category: updatedContedData.category,
        },
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
  }

  async deleteById(contentId: string): Promise<boolean | null> {
    try {
      const content = await ContentModel.findByIdAndDelete(contentId, { new: true });

      return content !== null;
    } catch (error) {
      throw new Error("something happend in deleteById");
    }
  }

  async voteById(userId: string, blogId: string, voteType: string = 'upvote'): Promise<boolean | null> {
    try {

      const updateQuery: UpdateQuery<{ upvotes?: string[]; downvotes?: string[] }> = {};
  
      if (voteType === 'upvote') {
        updateQuery.$addToSet = { upvotes: userId };
        updateQuery.$pull = { downvotes: userId };

      } else if (voteType === 'downvote') {
        updateQuery.$addToSet = { downvotes: userId };
        updateQuery.$pull = { upvotes: userId };
      } else {
        throw new Error('Invalid vote type');
      }

      const check = await ContentModel.findById(blogId);
      if(check){
        if(voteType === 'upvote' && check.upvotes.includes(userId)){
          delete updateQuery.$addToSet
          updateQuery.$pull = { upvotes: userId };
        } else if(voteType === 'downvote' && check.downvotes.includes(userId)){
          delete updateQuery.$addToSet
          updateQuery.$pull = { downvotes: userId };
        }

      };

      const content  = await ContentModel.findByIdAndUpdate(
        blogId,
        updateQuery,
        { new: true } 
      );
  
      return content !== null;
    } catch (error) {
      throw new Error('Something happened in voteById');
    }
  }

  async shareById(userId: string, blogId: string): Promise< boolean | null> {
    try {

      const updateQuery: Partial<{ $addToSet: { shares: string } }> = {};

      const check = await ContentModel.findById(blogId);
      
      if(!check?.shares.includes(userId)){
        updateQuery.$addToSet = {shares: userId}
      }

      const content = await ContentModel.findByIdAndUpdate(
        blogId,
        updateQuery,
        {new: true}
      );

      return content !== null;
    } catch (error) {
      throw new Error('Something happend in shareById')
    }
  }

  async getAggregatedData(filterConstraints: Filter): Promise< DashboardData |null> {
    try {
      const startOfYear = new Date(new Date('2024').getFullYear(), 0, 1); // January 1st of the current year
      const startDate = filterConstraints.startDate ? new Date(filterConstraints.startDate) : startOfYear;
      const endDate = filterConstraints.endDate ? new Date(filterConstraints.endDate) : new Date();
  
      const dateThreshold = new Date();
      dateThreshold.setDate(dateThreshold.getDate() - 7);

      type FilterMatchType = {
        createdAt?: { $gte: Date; $lte: Date };
        status?: string;
        category?: string;
      };
      
      const filterMatch: FilterMatchType = {};
      if (startDate && endDate) {
        filterMatch.createdAt = { $gte: startDate, $lte: endDate };
      }
      
      const [
        totalContent,
        mostLiked,
        mostShared,
        recentContent,
        trendingContents,
        popularCategory
      ] = await Promise.all([
  
        ContentModel.find(filterMatch),
  
        ContentModel.aggregate([
          { $match: filterMatch },
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
        ]),
  
        ContentModel.aggregate([
          { $match: filterMatch },
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
        ]),
  
        ContentModel.aggregate([
          { $match: filterMatch },
          { $sort: { createdAt: -1 } },
          { $limit: 10 },
        ]),
  
        ContentModel.aggregate([
          {
            $match: {
              createdAt: { $gte: dateThreshold, $lte: endDate },
              ...filterMatch,
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
        ]),
  
        ContentModel.aggregate([
          {
            $match: {
              createdAt: { $gte: dateThreshold, $lte: endDate },
              ...filterMatch,
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
        ]),
      ]);
  
      return {
        totalContent  ,
        mostLiked,
        mostShared,
        recentContent,
        trendingContents,
        popularCategory,
      } as unknown as DashboardData;
    } catch (error) {
      throw new Error("Something happened in getAggregatedData: ");
    }
  }
  
}
