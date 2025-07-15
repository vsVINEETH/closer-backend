import { Filter } from "../../../../types/express/index";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { SearchFilterSortParams } from "../../dtos/CommonDTO";
import { EmployeeStats } from "../../dtos/EmployeeDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IMailer } from "../../interfaces/IMailer";
import { paramToQueryEmployee } from "../../../interfaces/utils/paramToQuery";
import { toEmployeePersistance } from "../../../infrastructure/mappers/employeeDataMapper";
import { EmployeeUseCaseResponse } from "../../types/EmployeeTypes";

export class EmployeeManagement {
    constructor(
        private _employeeRepository: IEmployeeRepository,
        private _bcrypt: IBcrypt,
        private _mailer: IMailer
    ) { }

        private async _fetchAndEnrich(query: SearchFilterSortParams): Promise<EmployeeUseCaseResponse> {
            try {
               const queryResult = await paramToQueryEmployee(query);
                const total = await this._employeeRepository.countDocs(queryResult.query);
                const employees = await this._employeeRepository.findAll(
                    queryResult.query,
                    queryResult.sort,
                    queryResult.skip,
                    queryResult.limit
                );
    
                return { employee: employees ?? [], total: total ?? 0 };  
            } catch (error) {
                throw new Error('Something happend fetchAndEnrich')
            };
        };
    

    async fetchData(options: SearchFilterSortParams): Promise<EmployeeUseCaseResponse | null> {
        try {
            const employess = await this._fetchAndEnrich(options);
            return employess ?? null;
        } catch (error) {
            throw new Error("something happend in fetchData");
        };
    };

    async createEmployee(employeeName: string, email: string, query: SearchFilterSortParams): Promise<EmployeeUseCaseResponse| null> {
        try {
            const result = await this._employeeRepository.findByEmail(email);
    
            if (!result) {
                const password = Math.floor(100000 + Math.random() * 900000).toString();
                const htmlJoining = this._mailer.generateCredentialsEmailContent(
                    email,
                    password
                );

                this._mailer.SendEmail(email, "Joining Credentials", htmlJoining);

                const hashedPassword = await this._bcrypt.Encrypt(password);
                const userDataToPersist = toEmployeePersistance({name: employeeName, email, password: hashedPassword})
                await this._employeeRepository.create(userDataToPersist);

                const employees = await this._fetchAndEnrich(query);
                return employees ?? null;
            };
        
            return null;
        } catch (error) {
            throw new Error("something happend in createEmployee");
        }
    }

    async blockEmployee(employeeId: string, query: SearchFilterSortParams): Promise<EmployeeUseCaseResponse | null> {
        try {
            const employee = await this._employeeRepository.findById(employeeId);

            if (employee) {
                const status: boolean = !employee.isBlocked;
                const result = await this._employeeRepository.blockById(employeeId, status);
                if (!result) return null;

                const employees = await this._fetchAndEnrich(query)
                return employees ?? null;
            }

            return null;
        } catch (error) {
            throw new Error("something happend in blockEmployee");
        }
    }

    async dashboardData(filterConstraints: Filter): Promise<EmployeeStats[] | null> {
        try {
           const result = await this._employeeRepository.dashboardData(filterConstraints);
           if(!result){return null};
           return result;
        } catch (error) {
           throw new Error('something happend in dashboardData') 
        }
    };
};
