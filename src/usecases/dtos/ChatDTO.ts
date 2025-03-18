

export interface ChatDTO {
      sender:string;
      receiver:string;
      message: string;
      type: 'text' | 'image' | 'audio' | 'call';
      callType: 'video' | 'audio';
      callDuration: number;
      isMissed: boolean;
      isRead: boolean;
      createdAt: Date,
      status:string,
}


export interface Messages {
  _id: string;
  sender: string;
  receiver: string;
  message: string;
  type: string;
  status: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
}

  export interface CallLogType  {
          sender: string,
          receiver: string,
          type:string,
          status: string,
          callType: string,
          callDuration: number,
          isMissed: boolean,
          isRead:boolean,
  }

  export type MatchedUserMessage = {
    pair: string;
    messages: {
      messages: any[]; // Replace 'any' with the actual message type
      unreadCount: number;
    };
    unreadCount: number; // Ensure this matches the structure
  };
  
  export interface Location {
    coordinates: [number, number];
    place: {
      city: string;
      state: string;
      country: string;
    };
  }
  
  export interface PrimeDetails {
    billedAmount: number;
    endDate: Date;
    isPrime: boolean;
    primeCount: number;
    startDate: Date;
    type: "weekly" | "monthly" | "yearly"; // Adjust as needed
  }
  
  export interface Match {
    _id: string;
    username: string;
    email: string;
    image: string[];
  }
  
  export interface UserDetails {
    _id: string;
    username: string;
    email: string;
    password: string;
    phone: string;
    image: string[];
    setupCompleted: boolean;
    isBlocked: boolean;
    isBanned: boolean;
    banExpiresAt: Date | null;
    blockedUsers: string[];
    reportedUsers: string[];
    createdAt: Date;
    updatedAt: Date;
    dob: string;
    gender: string; // Adjust based on allowed values
    interestedIn:string;
    lookingFor: string // Adjust as needed
    matches: Match[];
    interests: string[];
    location: Location;
    prime?: PrimeDetails;
    __v: number;
  }
  
export interface ChatMessage {
      _id?: string,
      sender: string,
      senderProfile?: {
        _id: string,
        username: string,
        image: string[],
      }
      receiver: {
        _id: string,
        username: string,
        image: string,
      },
      message: string,
      type: string,
      callType: string,
      callDuration: number,
      isMissed: boolean,
      isRead: boolean,
      status: string,
      createdAt: string,
    }