import { ParsedQs } from "../../../types/express";
import { SearchFilterSortParams } from "../../usecases/dtos/CommonDTO";

   export const paramsNormalizer = async (query: ParsedQs ) => {
      try {
        const filterOptions: SearchFilterSortParams = {
          search: query.search as string ?? '',
          startDate: query.startDate as string ?? '',
          endDate: query.endDate as string ?? '',
          status: query.status === undefined ? undefined : query.status === 'true', // Convert string to boolean
          sortColumn: query.sortColumn as string ?? '',
          sortDirection: query.sortDirection as string ?? '',
          page: query.page ? Number(query.page) : 0, // Convert to number
          pageSize: query.pageSize ? Number(query.pageSize) :0,
        };

        return filterOptions ?? {};
      } catch (error) {
       throw new Error('something went wrong') 
      };
    };