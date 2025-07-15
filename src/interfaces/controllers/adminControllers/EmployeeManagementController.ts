import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { paramsNormalizer } from "../../utils/filterNormalizer";

import { empManagementUseCase } from "../../../di/admin.di";

import {toEmployeeDTOs } from "../../mappers/employeeDTOMapper";

export class EmployeeManagementController {

    constructor(
        private _empMgntUseCase = empManagementUseCase
    ){};

    fetchEmployeesData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query);
            const employeeData = await this._empMgntUseCase.fetchData(filterOptions);
            if (employeeData) {
                res.status(HttpStatus.OK).json({
                     employee: toEmployeeDTOs(employeeData.employee),
                     total: employeeData.total
                    });
                return;
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
            const employeeData = await this._empMgntUseCase.createEmployee(name, email, filterOptions);
            if (employeeData) {
                res.status(HttpStatus.OK).json({
                     employeeData:{
                        employee: toEmployeeDTOs(employeeData.employee),
                        total: employeeData.total
                     },
                     message: ResponseMessages.CREATED_SUCCESSFULLY 
                    })
                return;
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
            const employeeData = await this._empMgntUseCase.blockEmployee(employeeId, filterOptions);
            if (employeeData) {
                res.status(HttpStatus.OK).json({
                          employee: toEmployeeDTOs(employeeData.employee),
                          total: employeeData.total
                        });
                return;
            };
            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.RESOURCE_NOT_FOUND })
            return;
        } catch (error) {
            next(error);
        }
    };

};

export const employeeManagementController = new EmployeeManagementController();