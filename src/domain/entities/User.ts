export class User {
  constructor(
    public id: string,
    public username: string,
    public email: string,
    public password?: string,
    public phone?: string,
    public dob?: string,
    public gender?: string,
    public interestedIn?: string,
    public lookingFor?: string,
    public image?: string[] | File[], 
    public isBlocked?: boolean,
    public isBanned?: boolean,
    public banExpiresAt?: string | null,
    public setupCompleted?: boolean,
    public createdAt?: string,
    public blockedUsers?: string[],
    public reportedUsers?: string[],
    public matches?: string[],
    public location?: Location,  
    public prime?: Prime,
  ) {}
}

interface Prime{
    isPrime: boolean
    type: string
    startDate: Date, 
    endDate: Date,
    primeCount: number,
    billedAmount: number
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
