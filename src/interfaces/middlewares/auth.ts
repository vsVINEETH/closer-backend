import { Request, Response, NextFunction, RequestHandler } from "express";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { EmployeeRepository } from "../../infrastructure/repositories/EmployeeRepositoy";
import { HttpStatus } from "../constants/HttpStatus";
import { ResponseMessages } from "../constants/ResponseMessages";

const userRepository = new UserRepository()
const employeeRepository = new EmployeeRepository()

export const auth = (): RequestHandler =>{
    return async(req: Request, res: Response, next: NextFunction) => {
       try {
         const currentUser = req.user;
         if(currentUser?.role === 'user'){
            const user = await userRepository.findById(currentUser.userId);
            if(user?.isBlocked || user?.isBanned){
                 res.status(HttpStatus.UNAUTHORIZED).json({message:ResponseMessages.ENTRY_RESTRICTED});
                 return;
            };
         };

         if(currentUser?.role =='employee'){
            const employee = await employeeRepository.findById(currentUser.userId)
            if(employee?.isBlocked){
               res.status(HttpStatus.UNAUTHORIZED).json({message:ResponseMessages.ENTRY_RESTRICTED});
               return 
            };
         };
         next()
       } catch (error) {
        next(error);
       };
    };
};