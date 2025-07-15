import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserModel } from "../persistence/models/UserModel";
import {
  passwordDTO,
  SetupUserDTO,
  UserDTO,
} from "../../usecases/dtos/UserDTO";
import { Types, UpdateWriteOpResult } from "mongoose";
import { SortOrder } from "../config/database";
import { Filter, Preferences } from "../../../types/express";
import { UserDetails } from "../../usecases/dtos/ChatDTO";
import { Prime } from "../../usecases/dtos/SubscriptionDTO";
import { UpdateResult } from "../../usecases/dtos/CommonDTO";
import { UserDocument } from "../persistence/interfaces/IUserModel";

export class UserRepository implements IUserRepository {
  
  async findByEmail(email: string): Promise<UserDTO | null> {
    try {
      const userDoc = await UserModel.findOne({ email });

      if (!userDoc) {
        return null;
      }

      return {
        id: userDoc.id,
        username: userDoc.username,
        email: userDoc.email,
        dob: userDoc.dob,
        password: userDoc.password,
        image: userDoc.image,
        phone: userDoc.phone,
        lookingFor: userDoc.lookingFor,
        interestedIn: userDoc.interestedIn,
        isBlocked: userDoc.isBlocked ?? false,
        isBanned: userDoc.isBanned,
        setupCompleted: userDoc.setupCompleted ?? false,
        prime: userDoc.prime
          ? {
              type: userDoc.prime.type ?? "Basic",
              isPrime: userDoc.prime.isPrime,
              primeCount: userDoc.prime.primeCount,
              startDate: userDoc.prime.startDate ?? undefined,
              endDate: userDoc.prime.endDate ?? undefined,
              billedAmount: userDoc.prime.billedAmount ?? 0,
            }
          : undefined,
      };
    } catch (error) {
      throw new Error("something happend in findByEmail");
    }
  }

  async findAll<T>(
        query: Record<string, T> = {},
        sort: { [key: string]: SortOrder } = {},
        skip: number = 0,
        limit: number = 0): Promise<{users: UserDTO[], total: number}| null> {
    try {

            const data = await UserModel.find(query)
            .sort(sort)
            .skip(skip)
            .limit(limit);

            const total = await UserModel.countDocuments(query)

            const users =  data.map(
                  (user) =>
                    new User(
                      user.id,
                      user.username,
                      user.email,
                      "",
                      user.phone,
                      user.dob,
                      user.gender,
                      user.interestedIn,
                      user.lookingFor,
                      user.image,
                      user.isBlocked,
                      user.isBanned,
                      user.banExpiresAt ? user.banExpiresAt.toLocaleDateString() : null,
                      user.setupCompleted,
                      user.createdAt.toLocaleDateString(),
                      user.blockedUsers,
                      user.reportedUsers,
                    )
              );

      return {users: users, total: total};
    } catch (error) {
      throw new Error("something happend in findAll");
    }
  }

  async findOtherUser(userId: string): Promise<UserDTO[] | null> {
    try {
      const userDoc = await UserModel.find({
        _id: { $ne: userId },
        isBanned: false,
        isBlocked: false,
      });

      if (!userDoc) {
        return null;
      }

      return userDoc.map(
        (user) =>
          new User(
            user.id,
            user.username,
            user.email,
            "",
            user.phone,
            user.dob,
            user.gender,
            user.interestedIn,
            user.lookingFor,
            user.image,
            user.isBlocked,
            user.isBanned,
            user.banExpiresAt ? user.banExpiresAt.toLocaleDateString() : null,
            user.setupCompleted,
            user.createdAt.toLocaleDateString()
          )
      );
    } catch (error) {
      throw new Error("something happend in findOtherUser");
    }
  }

  async findById(userId: string): Promise<UserDTO | null> {
    try {
      const user = await UserModel.findById(userId);
      return user
        ? {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            image: user.image,
            interestedIn: user.interestedIn,
            lookingFor: user.lookingFor,
            dob: user.dob,
            phone: user.phone ?? "",
            isBlocked: user.isBlocked,
            isBanned: user.isBanned,
            blockedUsers: user.blockedUsers,
            reportedUsers: user.reportedUsers,
            banExpiresAt: user.banExpiresAt
              ? user.banExpiresAt.toLocaleDateString()
              : null,
            createdAt: user.createdAt.toLocaleDateString(),
            prime: user.prime
              ? {
                  type: user.prime.type ?? "Basic",
                  isPrime: user.prime.isPrime,
                  primeCount: user.prime.primeCount,
                  startDate: user.prime.startDate ?? undefined,
                  endDate: user.prime.endDate ?? undefined,
                  billedAmount: user.prime.billedAmount ?? 0,
                }
              : undefined,
          }
        : null;
    } catch (error) {
      throw new Error("something happend in findById");
    }
  }

  async create(userData: User): Promise<void> {
    try {
      const newUser = new UserModel({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
      });
      await newUser.save();
    } catch (error) {
      throw new Error("something happend in create");
    }
  }

  async createAuthUser(userData: User): Promise<UserDTO> {
    try {
        const newAuthUser = new UserModel({
            username: userData.username,
            email: userData.email,
            setupCompleted: false,
            image: [],
        });

        const savedUser = await newAuthUser.save();

        return {
            id: savedUser.id,
            username: savedUser.username,
            email: savedUser.email,
            image: savedUser.image || [],
            setupCompleted: savedUser.setupCompleted || false,
        };
    } catch (error) {
        console.error("Error in createAuthUser:", error);
        throw new Error("Internal Server Error");
    }
 }

  async update(updatedData: SetupUserDTO): Promise<UserDTO | null> {
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
            image: image,
            setupCompleted: true,
            
          },
        },
        { new: true }
      );

      if (!userDoc) {
        return null;
      }

      return {
        id: userDoc.id,
        username: userDoc.username,
        email: userDoc.email,
        setupCompleted: userDoc.setupCompleted,
        image: userDoc.image,
        prime: userDoc.prime
        ? {
            type: userDoc.prime.type ?? "Basic",
            isPrime: userDoc.prime.isPrime,
            primeCount: userDoc.prime.primeCount,
            startDate: userDoc.prime.startDate ?? undefined,
            endDate: userDoc.prime.endDate ?? undefined,
            billedAmount: userDoc.prime.billedAmount ?? 0,
          }
        : undefined,
      };
    } catch (error) {
      throw new Error("something happend in update");
    }
  }

  async blockById(userId: string, status: boolean): Promise<boolean | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { isBlocked: status },
        { new: true }
      );
      if (user) {
        return true;
      }
      return null;
    } catch (error) {
      throw new Error("something happend in blockById");
    }
  }

  async updatePassword(userId: string, password: string): Promise<boolean | null> {
    try {
      const user = await UserModel.findByIdAndUpdate(
        userId,
        { password: password },
        { new: true }
      );
      if (user) {
        return true;
      }
      return null;
    } catch (error) {
      throw new Error("something happend in update password");
    }
  }

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
    }
  }

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
      if (user) {
        return true;
      }
      return null;
    } catch (error) {
      throw new Error("something happend in unBanById");
    }
  }

  async unbanExpiredUsers(now: Date): Promise<UpdateWriteOpResult> {
    try {
      const result = await UserModel.updateMany(
        { isBanned: true, banExpiresAt: { $lte: now } },
        { isBanned: false, banExpiresAt: null }
      );
      return result;
    } catch (error) {
      throw new Error("something happend in unbanExpriredUsers");
    }
  }

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
    }
  }

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
    }
  }

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
    }
  };

  async changeImageById(imageIndex: number, userId: string): Promise<boolean | null> {
    try {
      // Fetch user to get images array length
      const user = await UserModel.findById(userId);
      if (!user || !user.image|| user.image.length < 2) return null;
  
      const lastIndex = user.image.length - 1;
      
      // If the imageIndex is out of range or already the last index, do nothing
      if (imageIndex < 0 || imageIndex >= lastIndex) return false;
  
      // Swap the values at imageIndex and lastIndex
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            [`image.${imageIndex}`]: user.image[lastIndex],
            [`image.${lastIndex}`]: user.image[imageIndex]
          }
        },
        { new: true } // Return the updated document
      );
  
      return !!updatedUser;
    } catch (error) {
      console.error("Error in changeImageById:", error);
      throw new Error("Something happened in changeImageById");
    }
  }
  

  async blockUserById(blockedId: string, userId: string): Promise<boolean | null> {
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
      return updateData !== null;
    } catch (error) {
      throw new Error("something happend in blockUserById");
    }
  }

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
    }
  }

  async reportUseById(reportedId: string, userId: string): Promise<boolean | null> {
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
      return updateData !== null;
    } catch (error) {
      throw new Error("something happend in reportUseById");
    }
  }

  async findBlocked(userId: string, user: UserDTO): Promise<UserDTO[] | null> {
    try {
      const blockedUsers = user.blockedUsers
        ? user.blockedUsers.map((userId) => new Types.ObjectId(userId))
        : null;

      if (!blockedUsers || blockedUsers.length === 0) {
        return null;
      }

      const blockedList = await UserModel.find({
        _id: { $in: blockedUsers },
      }).select("username email image isBlocked");

      return blockedList.length > 0 ? (blockedList as UserDTO[]) : null;
    } catch (error) {
      throw new Error("something happend in findBlocked");
    }
  }

  async updatePrimeById(userId: string, primeData: Prime): Promise<UserDTO | null> {
    try {
      const { startDate, endDate, planType, billedAmount } = primeData;
      const user = await UserModel.findByIdAndUpdate(
        userId,
        {
          $set: {
            "prime.isPrime": true,
            "prime.type": planType,
            "prime.startDate": startDate,
            "prime.endDate": endDate,
            "prime.billedAmount": billedAmount,
          },
          $inc: {
            "prime.primeCount": 1,
          },
        },
        { new: true }
      );

      return user
        ? {
            id: user.id,
            username: user.username,
            email: user.email,
            password: user.password,
            image: user.image,
            interestedIn: user.interestedIn,
            lookingFor: user.lookingFor,
            dob: user.dob,
            phone: user.phone ?? "",
            isBlocked: user.isBlocked,
            isBanned: user.isBanned,
            blockedUsers: user.blockedUsers,
            reportedUsers: user.reportedUsers,
            banExpiresAt: user.banExpiresAt
              ? user.banExpiresAt.toLocaleDateString()
              : null,
            createdAt: user.createdAt.toLocaleDateString(),
            prime: user.prime
              ? {
                  type: user.prime.type ?? "Basic",
                  isPrime: user.prime.isPrime,
                  primeCount: user.prime.primeCount,
                  startDate: user.prime.startDate ?? undefined, // Ensure it's explicitly `undefined` if missing
                  endDate: user.prime.endDate ?? undefined, // Same for `endDate`
                  billedAmount: user.prime.billedAmount ?? 0
                }
              : undefined,
          }
        : null;
    } catch (error) {
      throw new Error("something happend in updatePrimeById");
    }
  }

  async primeValidityCheck(now: Date): Promise<UpdateWriteOpResult> {
    try {
      const result = await UserModel.updateMany(
        { 'prime.isPrime': true, 'prime.endDate': { $lte: now } },
        { 'prime.isPrime': false, 'prime.startDate': null, 'prime.endDate': null }
      );
      return result;
    } catch (error) {
      throw new Error("something happend in primeValidityCheck");
    }
  }

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
  }

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
  }

  async findMatchedUsers(userId: string): Promise<UserDetails | null> {
    try {
      const result = await UserModel.findById(userId).populate({
        path: "matches",
        select: "username email image _id",
      }).lean();

      
      if (!result) {
        return null;
      }
      return result as unknown as UserDetails;
    } catch (error) {
      throw new Error("something happend in findMatchedUsers");
    };
  }

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
  }

  async findMatches(userPreferences: Preferences): Promise<UserDTO[] | null> {
    try {
      const user = await UserModel.findById(userPreferences.userId);
      if (!user || !user?.location || !user?.location?.coordinates) {
        return [];
      };

      const blockedUsers = user.blockedUsers
        ? user.blockedUsers.map((userId) => new Types.ObjectId(userId))
        : [];

      const matched = user.matches;
      const interests = user.interests;

      // Calculate birthdate range for filtering
      const currentYear = new Date().getFullYear();
      let minDob;
      let maxDob;
      if (Array.isArray(userPreferences.ageRange) && userPreferences.ageRange.length === 2) {
        const [minAge, maxAge] = userPreferences.ageRange.map(Number); // Ensure numbers
        minDob = new Date(currentYear - maxAge, 0, 1); // Min birth year
        maxDob = new Date(currentYear - minAge, 11, 31); // Max birth year
    }

      const matches = await UserModel.aggregate([
        {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: user.location.coordinates, // User's current location
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
              { _id: { $nin: blockedUsers || [] } },
              { _id: { $nin: matched || [] } },
              { _id: { $nin: interests || [] } },
              { lookingFor: userPreferences.lookingFor }, 
              { gender: userPreferences.interestedIn }, 
              {interestedIn: user.gender},
              { 
                $expr: {
                  $and: [
                    { $gte: [{ $toDate: "$dob" }, minDob] },
                    { $lte: [{ $toDate: "$dob" }, maxDob] }
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
      return matches;
    } catch (error) {
      throw new Error("something happend in findMatches");
    }
  }

  async updateUserLocation(userId: string, newLat: number, newLon: number, state?: string, country?: string, city?: string ): Promise<User | null> {
    try {
      const updatedUser = await UserModel.findOneAndUpdate(
        { _id: userId },
        {
          $set: {
            'location.coordinates': [newLon, newLat],
            'location.place.state': state || null,
            'location.place.country': country || null,
            'location.place.city': city || null,
          },
        },
        { new: true }
      );
      return updatedUser ? updatedUser as unknown as User : null;

    } catch (error) {
      throw new Error('something happened in updateUserLocation')
    }
  }

  async findNearbyUsers(latitude: number, longitude: number, radius: number): Promise<User[] | null> {
    try {
      const radiusInMeters = radius * 1000;
      const users = await UserModel.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [longitude, latitude] },  // [longitude, latitude]
            distanceField: 'distance',  // The field that will store the calculated distance
            maxDistance: radiusInMeters, // Maximum distance in meters
            spherical: true, // Use spherical geometry for distance calculation
          },
        },
      ]);
    
      return users ? users : null;
    } catch (error) {
      throw new Error('something happend in findNearbyUsers')
    }
  }


  async dashboardData(filterConstraints: Filter): Promise<unknown> {
    try {
      const startOfYear = new Date(new Date('2024').getFullYear(), 0, 1); // January 1st of current year
      const startDate = filterConstraints.startDate ? new Date(filterConstraints.startDate) : startOfYear;
      const endDate = filterConstraints.endDate ? new Date(filterConstraints.endDate) : new Date();
  
      const result = await UserModel.aggregate([
        {
          $match: { createdAt: { $gte: startDate, $lte: endDate } },
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
  
      // Transform month number into month names (optional)
      const monthNames = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];
  
      const formattedMonthlyUsers = result[0].monthlyNewUsers.map((item: any) => ({
        month: monthNames[item._id.month - 1],
        count: item.count,
      }));
  
      return {
        ...result[0],
        monthlyNewUsers: formattedMonthlyUsers,
      };
    } catch (error) {
      throw new Error("Error fetching dashboard data");
    }
  }

};
