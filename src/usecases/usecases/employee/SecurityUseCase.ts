import { IEmployeeRepository } from "../../../domain/repositories/IEmployeeRepository";
import { EmployeeDTO, OtpDTO, passwordDTO } from "../../dtos/EmployeeDTO";
import { IBcrypt } from "../../interfaces/IBcrypt";
import { IToken } from "../../interfaces/IToken";
import { IOtp } from "../../interfaces/IOtp";
import { IMailer } from "../../interfaces/IMailer";
import { tempEmployeeStore } from "../../dtos/CommonDTO";
export class Security {
  constructor(
    private employeeRepository: IEmployeeRepository,
    private bcrypt: IBcrypt,
    private token: IToken,
    private OTP: IOtp,
    private mailer: IMailer
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
  }

  async changePassword(employeeId: string, newPasswordData: passwordDTO): Promise<boolean | null> {
    try {
      const employee = await this.employeeRepository.findById(employeeId);
      if (!employee) {
        return null;
      }

      const result = employee.password
        ? await this.bcrypt.compare(newPasswordData.currentPassword, employee.password)
        : false;

      if (result) {

        const hashedPassword = await this.bcrypt.Encrypt(newPasswordData.newPassword);
        await this.employeeRepository.updatePassword(
          employee.id,
          hashedPassword
        );

        return true;
      }

      return false;
    } catch (error) {
      throw new Error("something happend in changePassword");
    }
  }
}
