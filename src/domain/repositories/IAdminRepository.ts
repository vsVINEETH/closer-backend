import { AdminRepoDTO } from "../../usecases/dtos/AdminDTO";

export interface IAdminRepository {
    findByEmail(email: string): Promise<AdminRepoDTO | null>;
}