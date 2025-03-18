export interface IOtp {
    GenerateOTP():string;
    ValidateOTP(inputOTP: string, generatedOTP: string): boolean;
}