import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { SearchFilterSortParams } from "../../../usecases/dtos/CommonDTO";
import { contentUseCases } from "../../../di/general.di";
import { IContentUseCase } from "../../../usecases/interfaces/employee/IContentUseCase";
import { paramsNormalizer } from "../../utils/filterNormalizer";

export class EmployeeDashboardController {

       constructor(
        private _contentUseCase: IContentUseCase
       ){};

    dashboardData = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const filterConstraints: SearchFilterSortParams = await paramsNormalizer(req.query);
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


export const employeeDashboardController = new EmployeeDashboardController(contentUseCases)
