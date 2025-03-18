import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { setCookieOptions } from "../../utils/sessionCookie";

//use Case's
import { LogEmployee } from "../../../usecases/usecases/employee/LogUseCase";
import { Security } from "../../../usecases/usecases/employee/SecurityUseCase";

//repositories
import { EmployeeRepository } from "../../../infrastructure/repositories/EmployeeRepositoy";

//external services
import { Bcrypt } from "../../../infrastructure/services/Bcrypt";
import { Token } from "../../../infrastructure/services/Jwt";
import { Mailer } from "../../../infrastructure/services/Mailer";
import { OTP }from '../../../infrastructure/services/Otp';

export class EmployeeAuthController {
    private logUseCase: LogEmployee;
    private securityUseCase: Security;

    constructor(){
        const bcrypt = new Bcrypt();
        const token = new Token();
        const otp = new OTP();
        const mailer = new Mailer();
        const employeeRepository = new EmployeeRepository(); 

        this.logUseCase = new LogEmployee (employeeRepository, bcrypt, token);
        this.securityUseCase = new Security(employeeRepository, bcrypt, token, otp, mailer);
    };


    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { email, password } = req.body;
            const { emp, tokens, status } = await this.logUseCase.login(email, password);
        
            if (emp && tokens) {
            req.session.accessToken = tokens.accessToken;
            res.cookie("refreshToken", tokens.refreshToken, setCookieOptions);
            res.status(HttpStatus.OK).json({ employee: emp });
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
        const  newPasswordData = req.body.formData;
        const result = await this.securityUseCase.changePassword(employeeId, newPasswordData);
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