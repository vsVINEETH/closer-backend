import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { AdminRepoDTO } from "../../usecases/dtos/AdminDTO";
import { AdminModel } from "../persistence/models/AdminModel";
import { AdminDocument } from "../persistence/interfaces/IAdminModel";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<AdminDocument | null> {
    try {
      const admin = await AdminModel.findOne({ email });
      return admin;
    } catch (error) {
      throw new Error("something happend  findByEmail");
    }
  }
};
