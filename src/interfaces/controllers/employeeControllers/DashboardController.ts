import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//types
import { SearchFilterSortParams } from "../../../usecases/dtos/CommonDTO";
import { ParsedQs } from "../../../../types/express";
//useCase's
import { ContentManagement } from "../../../usecases/usecases/employee/ContentUseCase";

//repositories
import { ContentRepository } from "../../../infrastructure/repositories/ContentRepository";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";

//external services
import { Mailer } from "../../../infrastructure/services/Mailer";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";

export class EmployeeDashboardController {
    private contentUseCase: ContentManagement;

    constructor(){
        const mailer = new Mailer();
        const userRepository = new UserRepository();
        const contentRepository = new ContentRepository();
        const s3ClientAccessControll = new S3ClientAccessControll();
        this.contentUseCase = new ContentManagement(contentRepository, userRepository, mailer, s3ClientAccessControll);
    };

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
        const result = await this.contentUseCase.getDashboardData(filterConstraints);
       
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
