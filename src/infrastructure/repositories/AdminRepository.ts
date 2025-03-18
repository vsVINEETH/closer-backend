import { IAdminRepository } from "../../domain/repositories/IAdminRepository";
import { AdminRepoDTO } from "../../usecases/dtos/AdminDTO";
import { AdminModel } from "../persistence/models/AdminModel";

export class AdminRepository implements IAdminRepository {
  async findByEmail(email: string): Promise<AdminRepoDTO | null> {
    try {
      const admin = await AdminModel.findOne({ email });
      return admin
        ? { id: admin.id, email: admin.email, password: admin.password }
        : null;
    } catch (error) {
      throw new Error("something happend  findByEmail");
    }
  }
}
