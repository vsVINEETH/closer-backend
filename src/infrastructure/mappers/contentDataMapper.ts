import { ContentDocument } from "../persistence/interfaces/IContentModel";
import { Content } from "../../domain/entities/Content";
import { ContentDTO } from "../../usecases/dtos/ContentDTO";
import { ContentPersistanceType, ContentUpdateType } from "../types/ContentType";
import { Types } from "../../../types/express";

export function toContentEnityFromDoc(doc: ContentDocument): Content {
    return new Content({
        id: doc.id,
        title: doc.title,
        subtitle: doc.subtitle,
        content: doc.content,
        image: doc.image,
        isListed: doc.isListed,
        createdAt: doc.createdAt,
        category: doc.category,
        upvotes: doc.upvotes,
        downvotes: doc.downvotes,
        shares: doc.shares
    });
};

export function toContentEnitiesFromDocs(doc: ContentDocument[]): Content[] {
    return doc.map((d) => (
        new Content({
            id: d.id,
            title: d.title,
            subtitle: d.subtitle,
            content: d.content,
            image: d.image,
            isListed: d.isListed,
            createdAt: d.createdAt,
            category: d.category,
            upvotes: d.upvotes,
            downvotes: d.downvotes,
            shares: d.shares
        })
    ));
};

export function toContentPersistance(content: ContentDTO): ContentPersistanceType {
    return {
        title: content.title,
        subtitle: content.subtitle,
        content: content.content,
        image: content.image,
        category: content.category as Types.ObjectId
    };
};

export function toContentUpdate(content: ContentDTO): ContentUpdateType {
    return {
          title: content.title,
          subtitle: content.subtitle,
          content: content.content,
          isListed: content.isListed,
          category: content.category as Types.ObjectId,
    };
};