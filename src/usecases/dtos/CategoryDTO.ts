export interface CategoryDTO {
    id: string,
    name: string,
    isListed: boolean,
    createdAt: string,
};

export interface CreateCategoryDTO {
    name: string
};