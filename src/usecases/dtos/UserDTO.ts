interface Location {
  type: string;
  coordinates: [number, number];  // GeoJSON requires [longitude, latitude]
  place: {
    state: string | null;
    country: string | null;
    city: string | null;
  };
}



export interface UserDTO {
  id: string;
  username: string;
  email: string;
  password?: string;
  phone?: string;
  dob?: string;
  gender?: string;
  interestedIn?: string;
  lookingFor?: string;
  isBlocked?: boolean;
  isBanned?:boolean;
  banExpiresAt?:string | null;
  image?: string[] | File[];
  imageExpiry?: number | null;
  setupCompleted?: boolean;
  createdAt?: string | Date;
  blockedUsers?:string[],
  reportedUsers?:string[],
  prime?:{
    type:string,
    isPrime:boolean,
    primeCount: number,
    endDate: Date| undefined,
    startDate: Date | undefined,
    billedAmount: number
  }
  location?: Location,
}



export interface UserAuthDTO {
  id: string;
  username: string;
  email: string;
  image: string[] | File[];
  imageExpiry?: number | null;
  isBlocked:boolean;
  dob?: string;
  gender?: string;
  interestedIn?: string;
  lookingFor?: string;
  isBanned?:boolean;
  banExpiresAt?:string | null;
  setupCompleted?: boolean;
  createdAt?: string | Date;
  prime?:{
    type:string,
    isPrime:boolean,
    primeCount: number,
    endDate: Date| undefined,
    startDate: Date | undefined,
  }
}

export interface SingupDTO {
  username: string;
  email: string;
}
export interface SetupUserDTO {
  email: string;
  dob: string;
  gender: string;
  interestedIn: string;
  lookingFor: string;
  image: string[] | File[];
}

export interface CreateUserDTO {
  username: string;
  email: string;
  password: string;
  phone: string;
}

export interface OtpDTO {
  email: string;
  otp: string[];
}

export interface VerifyDTO {
  username: string;
  email: string;
}

export interface passwordDTO {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface forgotPasswordDTO{
  email: string,
  newPassword: string;
  confirmPassword?: string;
}