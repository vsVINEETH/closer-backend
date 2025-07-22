import { User } from "../../domain/entities/User";
import { IUserDocument } from "../persistence/interfaces/IUserModel";

export function toUserEntityFromDoc(doc: IUserDocument): User {
    try {
          return new User({
           id: doc.id,
           username: doc.username,
           email: doc.email,
           password: doc.password,
           phone: doc.phone,
           dob: doc.dob,
           gender: doc.gender,
           interestedIn: doc.interestedIn,
           lookingFor: doc.lookingFor,
           image: doc.image || [], 
           isBlocked: doc.isBlocked,
           isBanned: doc.isBanned,
           banExpiresAt: doc.banExpiresAt?.toLocaleDateString() ?? null,
           setupCompleted: doc.setupCompleted || false,
           createdAt: doc.createdAt.toLocaleDateString(),
           blockedUsers: doc.blockedUsers,
           reportedUsers: doc.reportedUsers,
           matches: doc.matches,
           interests: doc.interests,
           location: doc.location,  
           prime: doc.prime ? 
            {
                type: doc.prime.type ?? 'Basic',
                isPrime: doc.prime.isPrime,
                primeCount: doc.prime.primeCount,
                startDate: doc.prime.startDate,
                endDate: doc.prime.endDate,
                billedAmount: doc.prime.billedAmount ?? 0
            }: undefined,
        });  
    } catch (error) {
       throw new Error('Something happend in toUserEntityFromDoc')
    };
};


export function toUserEntitiesFromDocs(docs: IUserDocument[]): User[] {
    try {
         return docs.map((doc) => (
          new User({
           id: doc.id ?? doc._id,
           username: doc.username,
           email: doc.email,
           password: doc.password,
           phone: doc.phone,
           dob: doc.dob,
           gender: doc.gender,
           interestedIn: doc.interestedIn,
           lookingFor: doc.lookingFor,
           image: doc.image, 
           isBlocked: doc.isBlocked,
           isBanned: doc.isBanned,
           banExpiresAt: doc.banExpiresAt?.toLocaleDateString() ?? null,
           setupCompleted: doc.setupCompleted,
           createdAt: doc.createdAt.toLocaleDateString(),
           blockedUsers: doc.blockedUsers,
           reportedUsers: doc.reportedUsers,
           matches: doc.matches,
           interests: doc.interests,
           location: doc.location,  
           prime: doc.prime ? 
            {
                type: doc.prime.type ?? 'Basic',
                isPrime: doc.prime.isPrime,
                primeCount: doc.prime.primeCount,
                startDate: doc.prime.startDate,
                endDate: doc.prime.endDate,
                billedAmount: doc.prime.billedAmount ?? 0
            }: undefined,
        })
    ))   
    } catch (error) {
       throw new Error('Something happend in toUserEnititiesFromDocs') 
    };
};
