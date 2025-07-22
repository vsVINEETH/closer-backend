export interface AdvertisementDTO {
    id: string,
    title: string,
    subtitle: string,
    content: string,
    image: string[] | File[],
    isListed: boolean,
    createdAt: string,
}

export interface AdvertisementPersistanceDTO {
    id: string,
    title: string,
    subtitle: string,
    content: string,
    image: string[] | File[],
    isListed: boolean,
    createdAt: string,
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