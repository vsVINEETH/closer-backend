import { IContentDocument } from "../persistence/interfaces/IContentModel";
import { Content } from "../../domain/entities/Content";
import { ContentDTO } from "../../usecases/dtos/ContentDTO";
import { ContentPersistanceType, ContentUpdateType } from "../types/ContentType";
import { Types } from "../../../types/express";

export function toContentEnityFromDoc(doc: IContentDocument): Content {
    try {
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
    } catch (error) {
       throw new Error('Something happend in toContentEnityFromDoc') 
    };
};

export function toContentEnitiesFromDocs(doc: IContentDocument[]): Content[] {
    try {
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
    } catch (error) {
       throw new Error('Something happend in toContentEnitiesFromDocs') 
    };
};

export function toContentPersistance(content: ContentDTO): ContentPersistanceType {
    try {
        return {
            title: content.title,
            subtitle: content.subtitle,
            content: content.content,
            image: content.image,
            category: content.category as Types.ObjectId
        };  
    } catch (error) {
      throw new Error('Something happend in toContentPersistance')  
    };
};

export function toContentUpdate(content: ContentDTO): ContentUpdateType {
    try {
        return {
            id: content.id,
            title: content.title,
            subtitle: content.subtitle,
            content: content.content,
            isListed: content.isListed,
            category: content.category as Types.ObjectId,
        };   
    } catch (error) {
       throw new Error('Something happend in toContentUpdate') 
    };
};