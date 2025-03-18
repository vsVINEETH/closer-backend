import { IOtp } from "../../usecases/interfaces/IOtp";

export class OTP implements IOtp {

    GenerateOTP (): string {
        return Math.floor(1000 + Math.random() * 9000).toString();
    }

    ValidateOTP (inputOTP: string, generatedOTP: string): boolean {
       
       return inputOTP === generatedOTP;
    }

}