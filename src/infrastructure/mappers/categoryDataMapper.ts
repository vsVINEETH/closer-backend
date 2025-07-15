import { CategoryDocument } from "../persistence/interfaces/ICategoryModel";
import { Category } from "../../domain/entities/Category";

export function toCategoryEntityFromDoc(doc: CategoryDocument): Category {
    return new Category({
        id: doc.id.toString(),
        name: doc.name,
        isListed: doc.isListed,
        createdAt: doc.createdAt.toLocaleDateString()
    })
};

export function toCategoryEntitiesFromDoc(doc: CategoryDocument[]): Category[] {
    return doc.map((d) => (
        new Category({
            id: d.id,
            name: d.name,
            isListed: d.isListed,
            createdAt: d.createdAt.toLocaleDateString()
        })
    ));
};