import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../persistence/models/UserModel";
import {SetupUserDTO, UserDashBoardData} from "../../usecases/dtos/UserDTO";
import { Types, UpdateWriteOpResult } from "mongoose";
import { SortOrder } from "../config/database";
import { DateRange, DOBRange, Preferences } from "../../../types/express";
import { UserDetails } from "../../usecases/dtos/ChatDTO";
import { Prime } from "../../usecases/dtos/SubscriptionDTO";
import { toUserEntitiesFromDocs, toUserEntityFromDoc } from "../mappers/userDataMapper";
import { BaseRepository } from "./BaseRepository";
import { IUserDocument } from "../persistence/interfaces/IUserModel";

export class UserRepository extends BaseRepository<User, IUserDocument> implements IUserRepository {

  constructor(){
    super(UserModel, toUserEntityFromDoc, toUserEntitiesFromDocs)
  };
  
  async findByEmail(email: string): Promise<User | null> {
    try {
      const userDoc = await UserModel.findOne({ email });
      return userDoc ? toUserEntityFromDoc(userDoc): null;
    } catch (error) {
      throw new Error("something happend in findByEmail");
    };
  };

    async updateByEmail(updatedData: SetupUserDTO): Promise<User| null> {
    try {
      const { dob, gender, interestedIn, lookingFor, image } = updatedData;
      const userDoc = await UserModel.findOneAndUpdate(
        { email: updatedData.email },
        {
          $set: {
            dob,
            gender,
            interestedIn,
            lookingFor,
            image,
            setupCompleted: true,
          },
        },
        { new: true }
      );

      return userDoc ? toUserEntityFromDoc(userDoc) : null;
    } catch (error) {
      throw new Error("something happend in update");
    };
  };

  async findOtherUser(userId: string): Promise<User[] | null> {
    try {
      const userDocs = await UserModel.find({
        _id: { $ne: userId },
        isBanned: false,
        isBlocked: false,
      });
      return userDocs ? toUserEntitiesFromDocs(userDocs) : null;
    } catch (error) {
      throw new Error("something happend in findOtherUser");
    };
  };

 async createAuthUser(username: string, email: string): Promise<User> {
    try {
        const newAuthUser = new UserModel({
            username,
            email,
            setupCompleted: false,
            image: [],
        });

        const savedUser = await newAuthUser.save();
        return  toUserEntityFromDoc(savedUser);
    } catch (error) {
        throw new Error("Internal Server Error");
    };
 };


  async blockById(userId: string, status: boolean): Promise<boolean | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { isBlocked: status },
        { new: true }
      );

      return user ? true : null;
    } catch (error) {
      throw new Error("something happend in blockById");
    };
  };

  async updatePassword(userId: string, password: string): Promise<boolean | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { password: password },
        { new: true }
      );
      return user ? true : null;
    } catch (error) {
      throw new Error("something happend in update password");
    };
  };

  async banById(userId: string, duration: Date): Promise<boolean | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            isBanned: true,
            banExpiresAt: duration,
          },
        },
        { new: true }
      );
      return user !== null;
    } catch (error) {
      throw new Error("something happend in banById");
    };
  };

  async unBanById(userId: string): Promise<boolean | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            isBanned: false,
            banExpiresAt: null,
          },
        },
        { new: true }
      );

      return user ? true : null;
    } catch (error) {
      throw new Error("something happend in unBanById");
    };
  };

  async unbanExpiredUsers(now: Date): Promise<UpdateWriteOpResult> {
    try {
      const result = await UserModel.updateMany(
        { isBanned: true, banExpiresAt: { $lte: now } },
        { isBanned: false, banExpiresAt: null }
      );
      return result;
    } catch (error) {
      throw new Error("something happend in unbanExpriredUsers");
    };
  };

  async updateProfileById(
    field: string,
    value: string,
    userId: string
  ): Promise<boolean | null> {
    try {
      const updateData = { [field]: value };
      const result = await UserModel.findByIdAndUpdate(
        userId,
        { $set: updateData },
        { new: true }
      );
      return result !== null;
    } catch (error) {
      throw new Error("something happend in updateProfileById");
    };
  };

  async deleteImageById(userId: string, src: string): Promise<boolean | null> {
    try {
      const updateData = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: { image: src },
        },
        { new: true }
      );
      return updateData !== null;
    } catch (error) {
      throw new Error("something happend in deleteImageById");
    };
  };

  async addImageById(userId: string, src: string[]): Promise<boolean | null> {
    try {
      const updateData = await UserModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            image: {
              $each: src,
            },
          },
        },
        { new: true }
      );

      return updateData !== null;
    } catch (error) {
      throw new Error("something happend in addImageById");
    };
  };

  async changeImageById(imageIndex: number, lastIndex: number, userId: string, images: string[] | File[]): Promise<boolean | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            [`image.${imageIndex}`]: images[lastIndex],
            [`image.${lastIndex}`]: images[imageIndex]
          }
        },
        { new: true }
      );
  
      return !!updatedUser;
    } catch (error) {
      throw new Error("Something happened in changeImageById");
    };
  };
  
  async blockUserById(blockedId: string, userId: string): Promise<User | null> {
    try {
      const updateData = await UserModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            blockedUsers: blockedId,
          },
        },
        { new: true }
      );
      return updateData ? toUserEntityFromDoc(updateData) : null;
    } catch (error) {
      throw new Error("something happend in blockUserById");
    };
  };

  async unblockById(unblockId: string, userId: string): Promise<boolean | null> {
    try {
      const updateData = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            blockedUsers: unblockId,
          },
        },
        { new: true }
      );
      return updateData !== null;
    } catch (error) {
      throw new Error("something happend in unblockById");
    };
  };

  async reportUseById(reportedId: string, userId: string): Promise<User | null> {
    try {
      const updateData = await UserModel.findByIdAndUpdate(
        reportedId,
        {
          $push: {
            reportedUsers: userId,
          },
        },
        { new: true }
      );
      return updateData ? toUserEntityFromDoc(updateData) : null;
    } catch (error) {
      throw new Error("something happend in reportUseById");
    }
  };

  async findBlocked(blockedIds: string[]): Promise<User[] | null> {
    try {

      const blockedList = await UserModel.find({
        _id: { $in: blockedIds },
      });

      return blockedList.length ? toUserEntitiesFromDocs(blockedList) : null;
    } catch (error) {
      throw new Error("something happend in findBlocked");
    };
  };

  async updatePrimeById(userId: string, primeData: Prime): Promise<User| null> {
    try {
      const userDoc = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            "prime.isPrime": true,
            "prime.type": primeData.planType,
            "prime.startDate": primeData.startDate,
            "prime.endDate": primeData.endDate,
            "prime.billedAmount": primeData.billedAmount,
          },
          $inc: {
            "prime.primeCount": 1,
          },
        },
        { new: true }
      );

      return userDoc ? toUserEntityFromDoc(userDoc) : null;
    } catch (error) {
      throw new Error("something happend in updatePrimeById");
    }
  };

  async primeValidityCheck(now: Date): Promise<UpdateWriteOpResult> {
    try {
      const userDoc = await UserModel.updateMany(
        { 'prime.isPrime': true, 'prime.endDate': { $lte: now } },
        { 'prime.isPrime': false, 'prime.startDate': null, 'prime.endDate': null }
      );
      return userDoc;
    } catch (error) {
      throw new Error("something happend in primeValidityCheck");
    }
  };

  async addMatches(userId: string, interactorId: string): Promise<boolean> {
    try {
      
      const interactor = await UserModel.findByIdAndUpdate(
        interactorId,
        {
          $push: {
            matches: userId,
          },
          $pull: {
            interests: userId,
          },
        },
        { new: true }
      );

      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $push: {
            matches: interactorId,
          },
        },
        { new: true }
      );
      return interactor !== null && user !== null;
    } catch (error) {
      throw new Error("something happend in addMatches");
    }
  };

  async unmatchById(userId: string, interactorId: string): Promise<boolean> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $pull: {
            matches: interactorId,
          },
        },
        { new: true }
      );

      const interactor = await UserModel.findByIdAndUpdate(
        interactorId,
        {
          $pull: {
            matches: userId,
          },
        },
        { new: true }
      );

      return interactor !== null && user !== null;
    } catch (error) {
      throw new Error("something happend in unmatchById");
    }
  };


  async findMatchedUsers(userId: string): Promise<UserDetails | null> {
    try {
      const result = await UserModel.findById(userId).populate({
        path: "matches",
        select: "username email image _id",
      }).lean();

      if (!result) return null;
      return result as unknown as UserDetails ;
    } catch (error) {
      throw new Error("something happend in findMatchedUsers");
    };
  };

  async addInterests(userId: string, interactorId: string): Promise<boolean> {
    try {
      const interactor = await UserModel.findByIdAndUpdate(
        interactorId,
        {
          $push: {
            interests: userId,
          },
        },
        { new: true }
      );

      return interactor !== null;
    } catch (error) {
      throw new Error("something happend addInterests");
    }
  };

  async findMatches(userPreferences: Preferences, user: User, dobRange: DOBRange ): Promise<User[] | null> {
    try {

      const matches = await UserModel.aggregate([
        {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: user.location ? user.location.coordinates : [0,0] , // User's current location
          },
          distanceField: "distance",
          maxDistance: Number(userPreferences.distance) * 1000, // Convert km to meters
          spherical: true,
        },
      },
        {
          $match: {
            $and: [
              { _id: { $ne: new Types.ObjectId(userPreferences.userId) } },
              { _id: { $nin: user.blockedUsers || [] } },
              { _id: { $nin: user.matches || [] } },
              { _id: { $nin: user.interests || [] } },
              { lookingFor: userPreferences.lookingFor }, 
              { gender: userPreferences.interestedIn }, 
              {interestedIn: user.gender},
              { 
                $expr: {
                  $and: [
                    { $gte: [{ $toDate: "$dob" }, dobRange.minDob] },
                    { $lte: [{ $toDate: "$dob" }, dobRange.maxDob] }
                  ]
                }
              }
            ],
            isBanned: false,
            isBlocked: false,
            setupCompleted: true,
          },
        },

      ]);
      return matches ? toUserEntitiesFromDocs(matches): null;
    } catch (error) {
      throw new Error("something happend in findMatches");
    };
  };

  async updateUserLocation(userId: string, newLat: number, newLon: number, state?: string, country?: string, city?: string ): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            'location.coordinates': [newLon, newLat],
            'location.place.state': state,
            'location.place.country': country,
            'location.place.city': city,
          },
        },
        { new: true }
      );
      return updatedUser ? toUserEntityFromDoc(updatedUser) : null;
    } catch (error) {
      throw new Error('something happened in updateUserLocation')
    };
  };

  async findNearbyUsers(latitude: number, longitude: number, radius: number): Promise<User[] | null> {
    try {
      const radiusInMeters = radius * 1000;
      const userDocs = await UserModel.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },
            distanceField: 'distance', 
            maxDistance: radiusInMeters, 
            spherical: true, 
          },
        },
      ]);
    
      return userDocs ? toUserEntitiesFromDocs(userDocs): null;
    } catch (error) {
      throw new Error('something happend in findNearbyUsers')
    };
  };

  async dashboardData(dateRange: DateRange): Promise<UserDashBoardData> {
    try {
      const result = await UserModel.aggregate([
        {
          $match: { createdAt: { $gte: dateRange.startDate, $lte: dateRange.endDate } },
        },
        {
          $facet: {
            totalUsers: [{ $count: "count" }],
            activeUsers: [
              { $match: { isBlocked: false, isBanned: false } },
              { $count: "count" },
            ],
            primeMembers: [
              { $match: { "prime.isPrime": true } },
              { $count: "count" },
            ],
            newUsers: [
              { $count: "count" },
            ],
            monthlyNewUsers: [
              {
                $group: {
                  _id: { month: { $month: "$createdAt" } },
                  count: { $sum: 1 },
                },
              },
              { $sort: { "_id.month": 1 } },
            ],
            genderSplit: [{ $group: { _id: "$gender", count: { $sum: 1 } } }],
          },
        },
      ]);
  
      return result[0];
    } catch (error) {
      throw new Error("Error fetching dashboard data");
    };
  };
};
