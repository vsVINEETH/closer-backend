import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { passwordDTO } from "../../dtos/EmployeeDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IEmployeeSecurityUseCase } from "../../interfaces/employee/ISecurityUseCase";

export class Security implements IEmployeeSecurityUseCase {
  constructor(
    private _employeeRepository: IEmployeeRepository,
    private _bcrypt: IBcrypt,
  ) {}

  async changePassword(employeeId: string, newPasswordData: passwordDTO): Promise<boolean | null> {
    try {
      const employee = await this._employeeRepository.findById(employeeId);
      if(employee){
        let result = await this._bcrypt.compare(newPasswordData.currentPassword, employee.password)

        if(result){
          const hashedPassword = await this._bcrypt.Encrypt(newPasswordData.newPassword);
          await this._employeeRepository.update(
            employee.id,
            {password: hashedPassword}
          );
          return true;
        }; 
      };

      return false;
    } catch (error) {
      throw new Error("something happend in changePassword");
    };
  };
};
