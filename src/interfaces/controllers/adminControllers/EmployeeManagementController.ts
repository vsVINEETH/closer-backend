import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { EmployeeManagement } from "../../../usecases/usecases/admin/EmpMgntUseCase";


//repositories
import { EmployeeRepository } from "../../../infrastructure/repositories/EmployeeRepositoy";

//external services
import { Bcrypt } from "../../../infrastructure/services/Bcrypt";
import { Mailer } from "../../../infrastructure/services/Mailer";
import { SearchFilterSortParams } from "../../../usecases/dtos/CommonDTO";

//helper methods, types, and utils
import { paramsNormalizer } from "../../utils/filterNormalizer";


export class EmployeeManagementController {
    private empMgntUseCase: EmployeeManagement;

    constructor(){
        const bcrypt = new Bcrypt();
        const mailer = new Mailer;
        const employeeRepository = new EmployeeRepository();

        this.empMgntUseCase = new EmployeeManagement(employeeRepository, bcrypt, mailer)
    };

    fetchEmployeesData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query);
            const employeeData = await this.empMgntUseCase.fetchData(filterOptions);
            if (employeeData) {
                res.status(HttpStatus.OK).json(employeeData);
                return
            };
            res.status(HttpStatus.NO_CONTENT).json({ message: ResponseMessages.NO_CONTENT_OR_DATA});
            return;
        } catch (error) {
            next(error)
        }
    };

    createEmployee = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { name, email } = req.body;
            const filterOptions = await paramsNormalizer(req.query);
            const employeeData = await this.empMgntUseCase.createEmployee(name, email, filterOptions);
            if (employeeData) {
                res.status(HttpStatus.OK).json({ employeeData, message: ResponseMessages.CREATED_SUCCESSFULLY })
                return
            }
            res.status(HttpStatus.CONFLICT).json({ message: ResponseMessages.EXISTING_RESOURCE })
            return
        } catch (error) {
            next(error)
        }
    };

    blockEmployee = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const employeeId = req.body.id;
            const filterOptions = await paramsNormalizer(req.query);
            const employeeData = await this.empMgntUseCase.blockEmployee(employeeId, filterOptions);
            if (employeeData) {
                res.status(HttpStatus.OK).json(employeeData);
                return
            }
            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.RESOURCE_NOT_FOUND })
            return
        } catch (error) {
            next(error)
        }
    };

};

export const employeeManagementController = new EmployeeManagementController();