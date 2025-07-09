import { ClientQuery, Filter } from "../../../../types/express/index";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { EmployeeAccessDTO, EmployeeCreate, EmployeeStats } from "../../dtos/EmployeeDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IMailer } from "../../interfaces/IMailer";
import { paramToQueryEmployee } from "../../../interfaces/utils/paramToQuery";
import { toDTO, toDTOs, toEntities, toEntity, toPersistance } from "../../mappers/EmployeeMapper";
export class EmployeeManagement {
    constructor(
        private employeeRepository: IEmployeeRepository,
        private bcrypt: IBcrypt,
        private mailer: IMailer
    ) { }

    async fetchData(options: SearchFilterSortParams): Promise<{ employee: EmployeeAccessDTO[]; total: number } | null> {
        try {
           
            const queryResult = await paramToQueryEmployee(options);
            const employees = await this.employeeRepository.findAll(
                queryResult.query,
                queryResult.sort,
                queryResult.skip,
                queryResult.limit
            );

            const employeeEntity = toEntities(employees);
            if(employeeEntity === null) return null;

            const employeeData = toDTOs(employeeEntity)
            console.log(employeeData)
            if (!employeeData) return null;
            
            const employeeCount = await this.employeeRepository.countDocs(queryResult.query)
            console.log(employeeCount,'helo')

            return { employee: employeeData.employee, total: employeeCount };
        } catch (error) {
            throw new Error("something happend in fetchData");
        }
    };

    async createEmployee(employeeName: string, email: string, query: SearchFilterSortParams): Promise<{ employee: EmployeeAccessDTO[]; total: number }| null> {
        try {
            const result = await this.employeeRepository.findByEmail(email);
    
            console.log(result)

            if (!result) {
                const password = Math.floor(100000 + Math.random() * 900000).toString();
                console.log(password);
                const htmlJoining = this.mailer.generateCredentialsEmailContent(
                    email,
                    password
                );
                this.mailer.SendEmail(email, "Joining Credentials", htmlJoining);

                const hashedPassword = await this.bcrypt.Encrypt(password);
                const userDataToPersist = toPersistance({name:employeeName, email, password: hashedPassword})

                await this.employeeRepository.create(userDataToPersist)
                const queryResult = await paramToQueryEmployee(query)
                const employeesDoc = await this.employeeRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );

                const employeeEntity = toEntities(employeesDoc);
                if(employeeEntity === null) return null;

                const employeeData = toDTOs(employeeEntity)
                const employeeCount = await this.employeeRepository.countDocs(queryResult.query);

                return  employeeData ? { employee: employeeData.employee, total: employeeCount } : null;
            };
        
            return null;
        } catch (error) {
            throw new Error("something happend in createEmployee");
        }
    }

    async blockEmployee(employeeId: string, query: SearchFilterSortParams): Promise<{ employee: EmployeeAccessDTO[]; total: number } | null> {
        try {
            const employeeDocs = await this.employeeRepository.findById(employeeId);

            if(employeeDocs === null) return null;
            const employeeEntity = toEntity(employeeDocs);

            if(employeeEntity === null) return null;
            const employee = toDTO(employeeEntity);
            
            if (employee) {
                const status: boolean = !employee.isBlocked;

                const result = await this.employeeRepository.blockById(employeeId, status);
                if (!result) return null;

                const queryResult = await paramToQueryEmployee(query)
                const employees = await this.employeeRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );
                const employeeEntity = toEntities(employees);
                if(employeeEntity === null) return null;

                const employeeData = toDTOs(employeeEntity);
                const employeeCount = await this.employeeRepository.countDocs(queryResult.query);
                return  employeeData ? { employee: employeeData.employee, total: employeeCount } : null;
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
    };
};
