import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { EmployeeDTO } from "../../dtos/EmployeeDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IToken } from "../../interfaces/IToken";
import { toDTO, toEntity } from "../../mappers/EmployeeMapper";

export class LogEmployee {
    private role: string;
    constructor(
        private employeeRepository: IEmployeeRepository,
        private bcrypt: IBcrypt,
        private token: IToken,
    ) { this.role = 'employee' };

    generateToken(empId: string, role: string): { accessToken: string, refreshToken: string } {
        try {
            return this.token.generateTokens(empId, role);
        } catch (error) {
            throw new Error('something happend in generateToken')
        }

    };

    async login(email: string, password: string): Promise<{ emp: EmployeeDTO | null, tokens: { accessToken: string, refreshToken: string } | null, status: boolean }> {
        try {
            const employeeDoc = await this.employeeRepository.findByEmail(email);

            if(employeeDoc == null)  return { emp: null, tokens: null, status: false };
            const employeeEntity = toEntity(employeeDoc);

            if(employeeEntity == null)  return { emp: null, tokens: null, status: false };
            const employee = toDTO(employeeEntity);

            if (!employee) { return { emp: null, tokens: null, status: false } };
            if (employee.isBlocked === true) { return { emp: null, tokens: null, status: true } }

            const result = employee.password ? await this.bcrypt.compare(password, employee.password) : false;
            if (result) {
                const tokens = this.generateToken(employee.id, this.role);

                return {
                    emp: {
                        id: employee.id,
                        name: employee.name,
                        email: employee.email
                    },
                    tokens: tokens,
                    status: false
                };
            };

            return { emp: null, tokens: null, status: true };
        } catch (error) {
            throw new Error('something happend in login')
        }

    };

};