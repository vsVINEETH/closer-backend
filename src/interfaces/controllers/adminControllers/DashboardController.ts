import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { userManagementUseCase, empManagementUseCase, salesUseCases } from "../../../di/admin.di";
import { eventUseCase } from "../../../di/general.di";
import { IUserManagementUseCase } from "../../../usecases/interfaces/admin/IUserMgntUseCase";
import { IEmployeeManagementUseCase } from "../../../usecases/interfaces/admin/IEmpMgntUseCase";
import { IEventUseCase } from "../../../usecases/interfaces/admin/IEventUseCase";
import { ISalesUseCase } from "../../../usecases/interfaces/common/ISaleUseCase";

export class DashboardController {

    constructor(
        private _userMgntUseCase : IUserManagementUseCase,
        private _empMgntUseCase : IEmployeeManagementUseCase,
        private _eventUseCase : IEventUseCase,
        private _salesUseCase : ISalesUseCase
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
        };
    };
};

export const dashboardController = new DashboardController(userManagementUseCase, empManagementUseCase, eventUseCase,salesUseCases )