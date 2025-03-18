 export interface UpdateResult {
    acknowledged: boolean;
    modifiedCount: number;
    upsertedId: string | null;
    upsertedCount: number;
    matchedCount: number;
  }

  
export interface Filter {
  startDate: string,
  endDate: string,
}
  

  export interface SearchFilterSortParams {
    search: string,
    startDate: string,
    endDate: string,
    status: boolean | undefined,
    sortColumn:string,
    sortDirection: string,
    page: number,
    pageSize: number,
}

export const tempUserStore: { [key: string]: any} = {};
export const tempEmployeeStore: { [key: string]: any} = {};