import { Types } from "../../../types/express";


export interface DashboardData {
    totalContent: {
      content: string,
      createdAt: string,
      downvotes: string[]
      image: string[],
      isListed: boolean,
      shares: string[]
      subtitle: string,
      title: string,
      updatedAt: string,
      upvotes: string[]
      _id: string,
  
    }[],
  
    mostLiked: [{
      title: string,
      subtitle: string,
      content: string,
      image: string[],
      upvotesCount: number,
      createdAt: string,
    }],
  
    mostShared: [{
      title: string,
      subtitle: string,
      content: string,
      image: string[],
      sharesCount: number,
      createdAt: string,
    }],
  
    recentContent: [{
      content: string,
      createdAt: string,
      downvotes: string[]
      image: string[],
      isListed: boolean,
      shares: string[]
      subtitle: string,
      title: string,
      updatedAt: string,
      upvotes: string[]
      _id: string,
    }],
  
    trendingContents: [{
      content: string,
      createdAt: string,
      downvotes: string[]
      image: string[],
      isListed: boolean,
      shares: string[]
      subtitle: string,
      title: string,
      updatedAt: string,
      upvotes: string[]
      _id: string,
    }],
  
    popularCategory: [{
      _id: string,
      totalInteraction: number,
    }]
    
  }

export interface ContentDTO {
    id: string,
    title: string,
    subtitle: string,
    content: string,
    image: string[] | File[],
    isListed: boolean,
    createdAt: string,
    category?: Types.ObjectId,
    upvotes?: string[],
    downvotes?: string[],
    shares?: string[],
}


export interface Filter {
    startDate: string,
    endDate: string,
  }

export interface FetchParams {
    search?: string;
    startDate?: string;
    endDate?: string;
    status?: boolean;
    sortBy?: string;
    sortOrder?: string;
    page?: number;
    pageSize?: number;
  }