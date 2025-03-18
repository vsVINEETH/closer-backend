import mongoose,{ Document } from "mongoose";
export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    phone: string;
    dob: string;
    gender: string;
    image: string[] | File[];
    interestedIn: string;
    lookingFor: string;
    setupCompleted: boolean;
    isBlocked: boolean;
    createdAt: Date;
    updatedAt: Date;
    isBanned: boolean;
    blockedUsers:string[]; 
    reportedUsers:string[];
    banExpiresAt?: Date;
    prime?: {
        isPrime: boolean; 
        type: string;
        startDate?: Date;
        endDate?: Date;
        primeCount: number;
        billedAmount: number;
    };
    location?:Location
    matches:string[],
    interests: string[],
}

interface Location {
    type: string;
    coordinates: [number, number];  // GeoJSON requires [longitude, latitude]
    place: {
      state: string | null;
      country: string | null;
      city: string | null;
    };
  }
  