import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { setCookieOptions } from "../../utils/sessionCookie";

import { logEmployeeUseCase, securityUseCase } from "../../../di/employee.di";

import { toEmployeeDTO } from "../../mappers/employeeDTOMapper";

export class EmployeeAuthController {

    constructor(
    private _logUseCase = logEmployeeUseCase,
    private _securityUseCase = securityUseCase,

    ){}


    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const { emp, tokens, status } = await this._logUseCase.login(email, password);
        
            if (emp && tokens) {
            req.session.accessToken = tokens.accessToken;
            res.cookie("refreshToken", tokens.refreshToken, setCookieOptions);
            res.status(HttpStatus.OK).json({ employee: toEmployeeDTO(emp) });
            return
            } else if(status) {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.UNAUTHORIZED_ACTION});
            return
            } else {
            res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.INVALID_CREDENTIALS});
            return
            }
        } catch (error) {
            next(error)
        }
    };
    
    changePassword = async (req: Request, res: Response, next: NextFunction) => {
      try {
        const employeeId = req.body.id;
        const newPasswordData = req.body.formData;
        const result = await this._securityUseCase.changePassword(employeeId, newPasswordData);
        if (result) {
          res.status(HttpStatus.OK).json({ message: ResponseMessages.CREDENTIAL_UPDATED_SUCCESSFULLY });
          return;
        }
        res.status(HttpStatus.BAD_REQUEST).json({ message:ResponseMessages.INVALID_CREDENTIALS});
        return;
      } catch (error) {
        next(error)
      }
    };


    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
          req.session.accessToken = null;
          res.clearCookie("refreshtoken", { ...setCookieOptions, maxAge: 0 });
          res.status(HttpStatus.ACCEPTED).json({ message: ResponseMessages.LOGGED_OUT });
        } catch (error) {
          next(error)
        }
    };
};

export const employeeAuthController = new EmployeeAuthController();