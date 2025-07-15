import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//types
import { SearchFilterSortParams } from "../../../usecases/dtos/CommonDTO";
import { ParsedQs } from "../../../../types/express";

import { contentUseCases } from "../../../di/general.di";

export class EmployeeDashboardController {

       constructor(
        private _contentUseCase = contentUseCases
       ){};

       private paramsNormalizer = async (query: ParsedQs ) => {
          try {
    
            const filterOptions: SearchFilterSortParams = {
              search: query.search as string,
              startDate: query.startDate as string,
              endDate: query.endDate as string,
              status: query.status === undefined ? undefined : query.status === 'true', // Convert string to boolean
              sortColumn: query.sortColumn as string,
              sortDirection: query.sortDirection as string,
              page: query.page ? Number(query.page) : 0, // Convert to number
              pageSize: query.pageSize ? Number(query.pageSize) :0,
            };
    
            return filterOptions;
          } catch (error) {
           throw new Error('something went wrong') 
          }
        }

    dashboardData = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filterConstraints:SearchFilterSortParams = await this.paramsNormalizer(req.query);
        const result = await this._contentUseCase.getDashboardData(filterConstraints);
       
        if(result){
          res.status(200).json(result);
          return;
        }
        res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA})
      } catch (error) {
        next(error)
      }
    };
};


export const employeeDashboardController = new EmployeeDashboardController()
