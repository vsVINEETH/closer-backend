import { Request, Response, NextFunction } from "express";

import { HttpStatus } from "../../../domain/enums/httpStatus";
import { ResponseMessages } from "../../../usecases/constants/commonMessages";

//useCase's
import { EmployeeManagement } from "../../../usecases/usecases/admin/EmpMgntUseCase";
import { UserManagement } from "../../../usecases/usecases/admin/UserMgntUseCase";
import { EventManagement } from "../../../usecases/usecases/admin/EventUseCase";
import { SalesManagement } from "../../../usecases/usecases/SalesUseCase";

//repositories
import { EmployeeRepository } from "../../../infrastructure/repositories/EmployeeRepositoy";
import { UserRepository } from "../../../infrastructure/repositories/UserRepository";
import { EventRepository } from "../../../infrastructure/repositories/EventRepository";
import { SalesRepository } from "../../../infrastructure/repositories/SalesRepository";

//external services
import { Bcrypt } from "../../../infrastructure/services/Bcrypt";
import { Mailer } from "../../../infrastructure/services/Mailer";
import { RazorpayService } from "../../../infrastructure/services/Razorpay";

//utils
import { paramsNormalizer } from "../../utils/filterNormalizer";
import { S3ClientAccessControll } from "../../../infrastructure/services/S3Client";

export class DashboardController {
    private userMgntUseCase: UserManagement;
    private empMgntUseCase: EmployeeManagement;
    private eventUseCase: EventManagement;
    private salesUseCase: SalesManagement;

    constructor(){
        const bcrypt = new Bcrypt();
        const mailer = new Mailer();
        const razorpay = new RazorpayService();
        const userRepository = new UserRepository();
        const employeeRepository = new EmployeeRepository();
        const eventRepository = new EventRepository();
        const salesRepository = new SalesRepository();
        const s3ClientAccessControll = new S3ClientAccessControll()
        
        this.userMgntUseCase = new UserManagement(userRepository);
        this.empMgntUseCase = new EmployeeManagement(employeeRepository, bcrypt, mailer);
        this.eventUseCase = new EventManagement(eventRepository, mailer, userRepository, razorpay, salesRepository, s3ClientAccessControll);
        this.salesUseCase = new SalesManagement(salesRepository, s3ClientAccessControll);
    };


     dashboardData = async (req: Request, res: Response, next: NextFunction) => {
        try {
            
            const filterConstraints = await paramsNormalizer(req.query)
            const [userData, employeeData, eventData, salesData] = await Promise.all([
                this.userMgntUseCase.dashboardUserData(filterConstraints),
                this.empMgntUseCase.dashboardData(filterConstraints),
                this.eventUseCase.dashboardData(filterConstraints),
                this.salesUseCase.getDashboarData(filterConstraints),
            ]);
    
            if(userData && employeeData && eventData && salesData){
                res.status(HttpStatus.OK).json({
                    userData,
                    employeeData,
                    eventData,
                    salesData,
                });
                return;
            }else{
                res.status(HttpStatus.NO_CONTENT).json({message: ResponseMessages.NO_CONTENT_OR_DATA});
                return;
            }
        } catch (error) {
           next(error) 
        }
    };
};

export const dashboardController = new DashboardController()