import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

import { paramsNormalizer } from "../../utils/filterNormalizer";

import { userManagementUseCase, empManagementUseCase, salesUseCases } from "../../../di/admin.di";
import { eventUseCase } from "../../../di/general.di";

export class DashboardController {

    constructor(
        private _userMgntUseCase = userManagementUseCase,
        private _empMgntUseCase = empManagementUseCase,
        private _eventUseCase = eventUseCase,
        private _salesUseCase = salesUseCases
    ){};


     dashboardData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const filterConstraints = await paramsNormalizer(req.query)
            const [userData, employeeData, eventData, salesData] = await Promise.all([
                this._userMgntUseCase.dashboardUserData(filterConstraints),
                this._empMgntUseCase.dashboardData(filterConstraints),
                this._eventUseCase.dashboardData(filterConstraints),
                this._salesUseCase.getDashboarData(filterConstraints),
            ]);
    
            if(userData && employeeData && eventData && salesData){
                res.status(HttpStatus.OK).json({
                    userData,
                    employeeData,
                    eventData,
                    salesData,
                });
                return;
            }else{
                res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
                return;
            }
        } catch (error) {
           next(error) 
        }
    };
};

export const dashboardController = new DashboardController()