import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { UserManagement } from "../../../usecases/usecases/admin/UserMgntUseCase";

//repositories
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { paramsNormalizer } from "../../utils/filterNormalizer";


export class UserManagementController {
    private userMgntUseCase: UserManagement;

    constructor(){
        const userRepository = new UserRepository();
        
        this.userMgntUseCase = new UserManagement(userRepository);
    };

    fetchUsersData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const filterOptions = await paramsNormalizer(req.query)
            const usersData = await this.userMgntUseCase.fetchData(filterOptions);
            if (usersData) {
                res.status(HttpStatus.OK).json(usersData);
                return
            }
            res.status(HttpStatus.NO_CONTENT).json({ message: ResponseMessages.NO_CONTENT_OR_DATA});
            return
        } catch (error) {
            next(error)
        }
    };

    blockUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.id;
            const filterOptions = await paramsNormalizer(req.query)
            const updatedData = await this.userMgntUseCase.blockUser(userId, filterOptions);
    
            if (updatedData) {
                res.status(HttpStatus.OK).json(updatedData);
                return
            }
            res.status(HttpStatus.NOT_FOUND).json({ message: ResponseMessages.RESOURCE_NOT_FOUND })
            return
        } catch (error) {
            next(error)
        }
    };


    banUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.body.id;
            const banDuration = req.body.duration;
            const filterOptions = await paramsNormalizer(req.query)
            const result = await this.userMgntUseCase.banUser(userId, banDuration, filterOptions);
            if(result){
                res.status(200).json(result);
                return
            }
            res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE});
            return
        } catch (error) {
            next(error)
        }
    };


    unBanUser = async (req: Request, res: Response, next: NextFunction) => {
        try {
           const userId = req.body.id;
           const filterOptions = await paramsNormalizer(req.query)
            const result = await this.userMgntUseCase.unBanUser(userId, filterOptions);
            if(result){
                res.status(HttpStatus.OK).json(result);
                return
            }
            res.status(HttpStatus.NOT_FOUND).json({message: ResponseMessages.FAILED_TO_UPDATE});
            return
    
        } catch (error) {
            next(error)
        }
    };
}

export const userManagementController = new UserManagementController();