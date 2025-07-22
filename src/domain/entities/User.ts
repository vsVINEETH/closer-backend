interface Prime{
    isPrime: boolean
    type: string
    startDate: Date | undefined, 
    endDate: Date | undefined,
    primeCount: number,
    billedAmount: number
};

interface Location {
  type: string;
  coordinates: [number, number];
  place: {
    state: string | null;
    country: string | null;
    city: string | null;
  };
};



export class User {
    public id: string;
    public username: string;
    public email: string;
    public password?: string;
    public phone?: string;
    public dob?: string;
    public gender?: string;
    public interestedIn?: string;
    public lookingFor?: string;
    public image?: string[] | File[];
    public isBlocked?: boolean;
    public isBanned?: boolean;
    public banExpiresAt?: string | null;
    public setupCompleted?: boolean;
    public createdAt?: string;
    public blockedUsers?: string[];
    public reportedUsers?: string[];
    public matches?: string[];
    public interests?: string[];
    public location?: Location;
    public prime?: Prime;

    constructor(props:{
           id: string,
           username: string,
           email: string,
           password?: string,
           phone?: string,
           dob?: string,
           gender?: string,
           interestedIn?: string,
           lookingFor?: string,
           image?: string[] | File[], 
           isBlocked?: boolean,
           isBanned?: boolean,
           banExpiresAt?: string | null,
           setupCompleted?: boolean,
           createdAt?: string,
           blockedUsers?: string[],
           reportedUsers?: string[],
           matches?: string[],
           interests?: string[],
           location?: Location,  
           prime?: Prime,
    }){
           this.id = props.id,
           this.username =  props.username,
           this.email = props.email,
           this.password = props.password,
           this.phone = props.phone,
           this.dob = props.dob,
           this.gender = props.gender,
           this.interestedIn = props.interestedIn,
           this.lookingFor = props.lookingFor,
           this.image = props.image, 
           this.isBlocked = props.isBlocked,
           this.isBanned = props.isBanned,
           this.banExpiresAt = props.banExpiresAt,
           this.setupCompleted = props.setupCompleted,
           this.createdAt = props.createdAt,
           this.blockedUsers = props.blockedUsers,
           this.reportedUsers = props.reportedUsers,
           this.matches = props.matches,
           this.interests = props.interests,
           this.location = props.location,  
           this.prime = props.prime
    }

};


