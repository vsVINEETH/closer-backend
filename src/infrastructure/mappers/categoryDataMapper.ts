import { ICategoryDocument } from "../persistence/interfaces/ICategoryModel";
import { Category } from "../../domain/entities/Category";

export function toCategoryEntityFromDoc(doc: ICategoryDocument): Category {
    try {
        return new Category({
            id: doc.id.toString(),
            name: doc.name,
            isListed: doc.isListed,
            createdAt: doc.createdAt.toLocaleDateString()
        });   
    } catch (error) {
      throw new Error('Something happend in toCategoryEntityFromDoc')  
    };
};

export function toCategoryEntitiesFromDoc(doc: ICategoryDocument[]): Category[] {
    try {
        return doc.map((d) => (
            new Category({
                id: d.id,
                name: d.name,
                isListed: d.isListed,
                createdAt: d.createdAt.toLocaleDateString()
            })
        ));    
    } catch (error) {
       throw new Error('Something happend in toCategoryEntitiesFromDoc') 
    };
};

export function toCategoryPersistance(categoryName: string): Category {
    try {
     const persist = { name: categoryName
      };
      return persist as Category
    } catch (error) {
      throw new Error('Something happend in toCategoryPersistance')  
    };
};