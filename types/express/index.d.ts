import 'express-session';
import 'express'
import { SortOrder } from '../../src/infrastructure/config/database';
import { Types } from '../../src/infrastructure/persistence/interfaces/IContentModel';
import { ParsedQs } from "qs";

export {ParsedQs}
export {Types}
export {SortOrder}

export const tempUserStore: { [key: string]: any} = {};
export const tempEmployeeStore: { [key: string]: any} = {};

declare module 'express-session' {
  interface SessionData {
    user?:{
      id: string,
      email?: string,
    } 
    accessToken: string | null;
    userAccessToken:string | null;
    adminAccessToken: string | null;
    employeeAccessToken: string | null;
    email: string | null;
    authValues?:{
      email: string | null,
      role: string | null,
    }
  }
}

export interface ClientQuery {
  $or?: { [key: string]: { $regex: string; $options: string } }[];
  isListed?: boolean;
  createdAt?: { $gte?: Date; $lte?: Date };
  isBlocked?:boolean;
  name?:string;
  email?: string;
}

declare module 'express' {
    interface Request {
        user?:{
            userId: string,
            role: string,
        }
    }
}

export type OptionsCorrectorResult = {
  query: Record<string, any>;
  sort: Record<string, 1 | -1>;
  skip: number;
  limit: number;
};


export type SocketUser  = {
  userId: string,
  socketId: string,
  profile:{
    username: string,
    image: string,
  }
}

 export type Participants = {
    caller: SocketUser,
    receiver: SocketUser
}

export type OngoingCall = {
    participants: Participants;
    isRinging: boolean;
}

export interface MissedCall extends  OngoingCall {
  caller: string,
  receiver: string
  type: string,
  status?:string,
  callType: string,
  callDuration: number,
  isMissedCall: boolean,
}


export interface Preferences {
  userId: string,
  interestedIn?: string;
  ageRange?: [number, number] | string | [string, string];
  distance?: number | string;
  lookingFor?: string;
};

export interface Filter {
  startDate: string,
  endDate: string ,
}
