import { Admin } from "../../domain/entities/Admin";
import { AdminDTO, AdminRepoDTO } from "../dtos/AdminDTO";
import { AdminDocument } from "../../infrastructure/persistence/interfaces/IAdminModel";

export function toAdminEntity(doc: AdminDocument): Admin {
  return new Admin(doc.id.toString(), doc.email, doc.password);
};

export function toAdminDTO(entity: Admin): AdminDTO {
  return {
    id: entity.id,
    email: entity.email,
  };
};
