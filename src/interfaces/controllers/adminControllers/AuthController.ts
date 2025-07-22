import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { setCookieOptions } from "../../utils/sessionCookie";
import { logAdminUseCase } from "../../../di/admin.di";
import { toAdminDTO } from "../../mappers/adminDTOMapper";
import { IAdminLogUseCase } from "../../../usecases/interfaces/admin/ILogUseCase";

export class AdminAuthController {

    constructor(
        private _logUseCase : IAdminLogUseCase
    ){};

    login = async (req: Request, res: Response, next: NextFunction) => {
        try {
    
            const { email, password } = req.body;
            const { admin, tokens } = await this._logUseCase.login(email, password);
    
            if (admin && tokens) {
                req.session.accessToken = tokens.accessToken;
                res.cookie('refreshToken', tokens.refreshToken, setCookieOptions);
                res.status(HttpStatus.OK).json({ admin: toAdminDTO(admin) })
                return;
            };

            res.status(HttpStatus.UNAUTHORIZED).json({ message: ResponseMessages.UNAUTHORIZED_ACTION })
            return;
        } catch (error) {
            next(error)
        };
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

export const adminAuthController = new AdminAuthController(logAdminUseCase);