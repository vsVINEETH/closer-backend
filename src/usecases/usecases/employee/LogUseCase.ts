import { Employee } from "../../../domain/entities/Employee";
import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { EmployeeLogDTO } from "../../dtos/EmployeeDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IToken } from "../../interfaces/IToken";
import { IEmployeeLogUseCase } from "../../interfaces/employee/ILogUseCase";

export class LogEmployee implements IEmployeeLogUseCase {
    private role: string;
    constructor(
        private _employeeRepository: IEmployeeRepository,
        private _bcrypt: IBcrypt,
        private _token: IToken,
    ) { this.role = 'employee' };

   private _generateToken(empId: string, role: string): { accessToken: string, refreshToken: string } {
        try {
            return this._token.generateTokens(empId, role);
        } catch (error) {
            throw new Error('something happend in generateToken')
        }
    };

    async login(email: string, password: string): Promise<EmployeeLogDTO> {
        try {
            const employee = await this._employeeRepository.findByEmail(email);
            if(employee){
                const result =  await this._bcrypt.compare(password, employee.password);
                if (result ) {
                    const tokens = this._generateToken(employee.id, this.role);

                    return {
                        emp: employee,
                        tokens: tokens,
                        status: false
                    };
                };
            };

            return { emp: null, tokens: null, status: true };
        } catch (error) {
            throw new Error('something happend in login')
        };
    };


    async checkUserStatus(userId: string): Promise<boolean> {
        try {
           const employeeData = await this._employeeRepository.findById(userId);
           return employeeData?.isBlocked ?? false;
        } catch (error) {
           throw new Error("Something happend in chekUserStatus") ;
        };
    };

};