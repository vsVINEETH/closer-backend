import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { AdminModel } from "../persistence/models/AdminModel";
import { Admin } from "../../domain/entities/Admin";
import { toAdminEntityFromDoc } from "../mappers/adminDataMapper";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<Admin| null> {
    try {
      const admin = await AdminModel.findOne({ email });
      return admin ? toAdminEntityFromDoc(admin) : null;
    } catch (error) {
      throw new Error("something happend findByEmail");
    };
  };
};
