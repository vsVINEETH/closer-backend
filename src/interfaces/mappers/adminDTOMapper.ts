import { Admin } from "../../domain/entities/Admin";
import { AdminDTO } from "../../usecases/dtos/AdminDTO";

export function toAdminDTO(entity: Admin): AdminDTO {
  return {
    id: entity.id,
    email: entity.email,
  };
};
