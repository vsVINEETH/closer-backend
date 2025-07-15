import { Content } from "../../domain/entities/Content";
import { ContentDTO, EmployeeDashboardDTO, MostLiked, MostShared, PopularCategory, RecentContent, TotalContent, TrendingContent } from "../../usecases/dtos/ContentDTO";

export function toContentDTO(entity: Content): ContentDTO{
    return {
            id: entity.id,
            title: entity.title,
            subtitle: entity.subtitle,
            content: entity.content,
            image: entity.image,
            isListed: entity.isListed,
            createdAt: entity.createdAt,
            category: entity.category,
            upvotes: entity.upvotes,
            downvotes: entity.downvotes,
            shares: entity.shares
       };
};

export function toContentDTOs(entities: Content[]): ContentDTO[]{

    return entities.map((en) => (
        {
            id: en.id,
            title: en.title,
            subtitle: en.subtitle,
            content: en.content,
            image: en.image,
            isListed: en.isListed,
            createdAt: en.createdAt,
            category: en.category,
            upvotes: en.upvotes,
            downvotes: en.downvotes,
            shares: en.shares  
        }
    ))
};



export function mapDashboardData(
  totalContent: TotalContent[],
  mostLiked: MostLiked[],
  mostShared: MostShared[],
  recentContent: RecentContent[],
  trendingContent: TrendingContent[],
  popularCategory: PopularCategory[]
): EmployeeDashboardDTO {
  return {
    totalContent: totalContent ?? [],

    mostLiked: (mostLiked ?? []).map(item => ({
      title: item.title,
      subtitle: item.subtitle,
      content: item.content,
      image: item.image,
      upvotesCount: item.upvotesCount || 0,
      createdAt: item.createdAt,
    })),

    mostShared: (mostShared ?? []).map(item => ({
      title: item.title,
      subtitle: item.subtitle,
      content: item.content,
      image: item.image,
      sharesCount: item.sharesCount || 0,
      createdAt: item.createdAt,
    })),

    recentContent: recentContent ?? [],

    trendingContents: trendingContent ?? [],

    popularCategory: (popularCategory ?? []).map(item => ({
      _id: item._id?.toString() ?? "",
      totalInteraction: item.totalInteraction ?? 0,
    })),
  };
}