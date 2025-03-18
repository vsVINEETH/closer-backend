export interface EmployeeDTO {
    id: string;
    name: string;
    email: string;
}

export interface EmployeeStats  {
    totalEmployees: [{ count: number }],
    activeEmployees: [{ count: number }],
  }

export interface EmployeeCreate {
    id?:string;
    name: string;
    email: string;
    password?: string;
    isBlocked?: false;
}

export interface EmployeeAccessDTO {
    id: string;
    name: string;
    email: string;
    password?: string;
    isBlocked?: boolean;
    createdAt?:string;
}

export interface passwordDTO {
    currentPassword: string,
    newPassword: string,
    confirmPassword?: string,
}

export interface OtpDTO{
    email: string;
    otp: string[];
}

export interface VerifyDTO {
    username: string;
    email: string;
}