interface Location {
  type: string;
  coordinates: [number, number];  // GeoJSON requires [longitude, latitude]
  place: {
    state: string | null;
    country: string | null;
    city: string | null;
  };
}

export type  UserLogDTO = { 
  user: UserDTO | null, 
  tokens: { accessToken: string, refreshToken: string } | null, 
  status: boolean | null
};

export type UserSignupDTO = { 
  user: UserDTO | null, tokens: { accessToken: string, refreshToken: string } | null,
  }

export type UserDashBoardData = {
    newUsers:{
      count: number
    }[],
    activeUsers:{
      count: number,
    }[],
    primeMembers:{
      count: number,
    }[],
    totalUsers:{
      count: number
    }[],
    monthlyNewUsers:{
      month: string,
      count: number
    }[],
    genderSplit:{
      _id: string,
      count: number
    }[],

}

export type UserDashBoardDTO = {
    newUsers:{
      count: number
    }[],
    activeUsers:{
      count: number,
    }[],
    primeMembers:{
      count: number,
    }[],
    totalUsers:{
      count: number
    }[],
    monthlyNewUsers:{
      month: string,
      count: number
    }[],
    genderSplit:{
      _id: string,
      count: number
    }[],

}

export interface MatchedUserDTO {
  id: string;
  username: string;
  dob?: string;
  gender?: string;
  interestedIn?: string;
  lookingFor?: string;
  image?: string[] | File[];
  imageExpiry?: number | null;
};

export interface UserProfileDTO {
  id: string;
  username: string;
  email: string;
  phone?: string;
  dob?: string;
  gender?: string;
  interestedIn?: string;
  lookingFor?: string;
  image?: string[] | File[];
  imageExpiry?: number | null;
  createdAt?: string | Date;
  prime?:{
    type?:string,
    isPrime?:boolean,
    primeCount?: number,
    endDate: Date| undefined,
    startDate: Date | undefined,
  }
  location?: Location,
};


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
};


export interface UserListingDTO {
    id: string;
    username: string;
    email: string;
    isBlocked?: boolean;
    isBanned?:boolean;
    image?: string[] | File[],
    banExpiresAt?:string | null;
    setupCompleted?: boolean;
    createdAt?: string | Date;
    reportedUsers?:string[],
};

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