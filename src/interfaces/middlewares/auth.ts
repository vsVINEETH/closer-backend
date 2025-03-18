import { Request, Response, NextFunction, RequestHandler } from "express";
import { IEmployeeRepository } from "../../domain/repositories/IEmployeeRepository";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { UserRepository } from "../../infrastructure/repositories/UserRepository";
import { EmployeeRepository } from "../../infrastructure/repositories/EmployeeRepositoy";
const userRepository = new UserRepository()
const employeeRepository = new EmployeeRepository()

export const auth = (): RequestHandler =>{
    return async(req: Request, res: Response, next: NextFunction) => {
       try {
         const currentUser = req.user;
         if(currentUser?.role === 'user'){
            const user = await userRepository.findById(currentUser.userId);
            if(user?.isBlocked || user?.isBanned){
                 res.status(401).json({message:"Entry has been restricted"});
                 return
            };
         };

         if(currentUser?.role =='employee'){
            const employee = await employeeRepository.findById(currentUser.userId)
            if(employee?.isBlocked){
               res.status(401).json({message:'You are is blocked'})
               return 
            };
         };
         next()
       } catch (error) {
        next(error);
       };
    };
};