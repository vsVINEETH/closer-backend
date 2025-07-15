import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { EmployeeDTO, OtpDTO, passwordDTO } from "../../dtos/EmployeeDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IToken } from "../../interfaces/IToken";
import { IOtp } from "../../interfaces/IOtp";
import { IMailer } from "../../interfaces/IMailer";
import { tempEmployeeStore } from "../../dtos/CommonDTO";
import { toDTO, toEntity } from "../../mappers/EmployeeMapper";
export class Security {
  constructor(
    private _employeeRepository: IEmployeeRepository,
    private _bcrypt: IBcrypt,
    private _token: IToken,
    private _OTP: IOtp,
    private _mailer: IMailer
  ) { }

  otpExpireation(email: string) {
    try {
      setTimeout(() => {
        if (tempEmployeeStore[email]) {
          delete tempEmployeeStore[email].otp;
          console.log(`OTP for ${email} has expired and been removed.`);
        }
      }, 60000);
    } catch (error) {
      throw new Error("something happend in otpExpireation");
    }
  };

  async changePassword(employeeId: string, newPasswordData: passwordDTO): Promise<boolean | null> {
    try {
      const employee = await this._employeeRepository.findById(employeeId);
      if(employee){
        let result = await this._bcrypt.compare(newPasswordData.currentPassword, employee.password)

        if(result){
          const hashedPassword = await this._bcrypt.Encrypt(newPasswordData.newPassword);
          await this._employeeRepository.updatePassword(
            employee.id,
            hashedPassword
          );

          return true;
        }; 
      };

      return false;
    } catch (error) {
      throw new Error("something happend in changePassword");
    }
  }
}
