import { ClientQuery, Filter } from "../../../../types/express/index";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { EmployeeAccessDTO, EmployeeStats } from "../../dtos/EmployeeDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IMailer } from "../../interfaces/IMailer";
import { paramToQueryEmployee } from "../../../interfaces/utils/paramToQuery";
export class EmployeeManagement {
    constructor(
        private employeeRepository: IEmployeeRepository,
        private bcrypt: IBcrypt,
        private mailer: IMailer
    ) { }


    async fetchData(options: SearchFilterSortParams): Promise<{ employee: EmployeeAccessDTO[]; total: number } | null> {
        try {
           
            const queryResult = await paramToQueryEmployee(options)
            const employeeData = await this.employeeRepository.findAll(
                queryResult.query,
                queryResult.sort,
                queryResult.skip,
                queryResult.limit
            );
            if (!employeeData) {
                return null;
            }
            
            return { employee: employeeData.employee, total: employeeData.total };
        } catch (error) {
            throw new Error("something happend in fetchData");
        }
    }

    async createEmployee(employeeName: string, email: string, query: SearchFilterSortParams): Promise<{ employee: EmployeeAccessDTO[]; total: number }| null> {
        try {
            const result = await this.employeeRepository.findByEmail(email);
            if (!result) {
                const password = Math.floor(100000 + Math.random() * 900000).toString();
                console.log(password);
                const htmlJoining = this.mailer.generateCredentialsEmailContent(
                    email,
                    password
                );
                this.mailer.SendEmail(email, "Joining Credentials", htmlJoining);

                const hashedPassword = await this.bcrypt.Encrypt(password);
                await this.employeeRepository.create({
                    name:employeeName,
                    email,
                    password: hashedPassword,
                });

                const queryResult = await paramToQueryEmployee(query)
                const employeeData = await this.employeeRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                )
                return  employeeData ? { employee: employeeData.employee, total: employeeData.total } : null;
            }
            return null;
        } catch (error) {
            throw new Error("something happend in createEmployee");
        }
    }

    async blockEmployee(employeeId: string, query: SearchFilterSortParams): Promise<{ employee: EmployeeAccessDTO[]; total: number } | null> {
        try {
            const employee = await this.employeeRepository.findById(employeeId);
            if (employee) {
                const status: boolean = !employee.isBlocked;

                const result = this.employeeRepository.blockById(employeeId, status);
                if (!result) {
                    return null;
                }

                const queryResult = await paramToQueryEmployee(query)
                const employeeData = await this.employeeRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                )
                return  employeeData ? { employee: employeeData.employee, total: employeeData.total } : null;
            }

            return null;
        } catch (error) {
            throw new Error("something happend in blockEmployee");
        }
    }

    async dashboardData(filterConstraints: Filter): Promise<EmployeeStats[] | null> {
        try {
           const result = await this.employeeRepository.dashboardData(filterConstraints);
           if(!result){return null};
           return result;
        } catch (error) {
           throw new Error('something happend in dashboardData') 
        }
    }
}
