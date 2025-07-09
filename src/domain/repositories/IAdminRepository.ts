import { AdminRepoDTO } from "../../usecases/dtos/AdminDTO";
import { AdminDocument } from "../../infrastructure/persistence/interfaces/IAdminModel";
export interface IAdminRepository {
    findByEmail(email: string): Promise<AdminDocument | null>;
};