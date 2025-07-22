import { Request, Response, NextFunction } from "express";
import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { userManagementUseCase } from "../../../di/admin.di";
import { IUserManagementUseCase } from "../../../usecases/interfaces/admin/IUserMgntUseCase";
import { toBanUserDTO, toBlockUserDTO, toUnbanUserDTO } from "../../mappers/userDTOMapper";

export class UserManagementController {
    constructor(
        private _userMgntUseCase : IUserManagementUseCase 
    ){};

    fetchUsersData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query);
            const usersData = await this._userMgntUseCase.fetchData(filterOptions);
            if (usersData) {
                res.status(HttpStatus.OK).json(usersData);
                return;
            };
            res.status(HttpStatus.NO_CONTENT).json({ message: ResponseMessages.NO_CONTENT_OR_DATA});
            return;
        } catch (error) {
            next(error);
        };
    };

    blockUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const {userId, filterOptions} = await toBlockUserDTO(req);
            const updatedData = await this._userMgntUseCase.blockUser(userId, filterOptions);
    
            if (updatedData) {
                res.status(HttpStatus.OK).json(updatedData);
                return;
            };

            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.RESOURCE_NOT_FOUND })
            return;
        } catch (error) {
            next(error);
        };
    };


    banUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const {userId, banDuration,filterOptions} = await toBanUserDTO(req)
            const result = await this._userMgntUseCase.banUser(userId, banDuration, filterOptions);
           
            if(result){
                res.status(200).json(result);
                return;
            };
            res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE});
            return;
        } catch (error) {
            next(error);
        };
    };

    unBanUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const {userId, filterOptions} = await toUnbanUserDTO(req);
            const result = await this._userMgntUseCase.unBanUser(userId, filterOptions);
            
            if(result){
                res.status(HttpStatus.OK).json(result);
                return;
            };

            res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE});
            return;
    
        } catch (error) {
            next(error);
        };
    };
};

export const userManagementController = new UserManagementController(userManagementUseCase);