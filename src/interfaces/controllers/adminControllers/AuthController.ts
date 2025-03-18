import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { setCookieOptions } from "../../utils/sessionCookie";

//useCase's
import { LogAdmin } from "../../../usecases/usecases/admin/LogUseCase";

//repositories
import { AdminRepository } from "../../../infrastructure/repositories/AdminRepository";

//external services
import { Token } from "../../../infrastructure/services/Jwt";
import { Bcrypt } from "../../../infrastructure/services/Bcrypt";

export class AdminAuthController {
    private logUseCase: LogAdmin;

    constructor(){
        const token = new Token();
        const bcrypt = new Bcrypt();
        const adminRepository = new AdminRepository();

        this.logUseCase = new LogAdmin(adminRepository, token, bcrypt)
    };

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
    
            const { email, password } = req.body;
            const { admin, tokens } = await this.logUseCase.login(email, password);
    
            if (admin && tokens) {
                req.session.accessToken = tokens.accessToken;
                res.cookie('refreshToken', tokens.refreshToken, setCookieOptions);
                res.status(HttpStatus.OK).json({ admin: admin })
                return;
            }
    
            res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.UNAUTHORIZED_ACTION })
            return;
        } catch (error) {
            next(error)
        }
    };


    logout = async (req: Request, res: Response, next: NextFunction) => {
        try {
            req.session.accessToken = null;
            res.clearCookie('refreshToken', { ...setCookieOptions, maxAge: 0 });
            res.status(HttpStatus.ACCEPTED).json({ message: ResponseMessages.LOGGED_OUT });
            return
        } catch (error) {
            next(error)
        }
    };
};

export const adminAuthController = new AdminAuthController();