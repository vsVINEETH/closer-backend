import { Admin } from "../../domain/entities/Admin";
import { AdminDTO } from "../../usecases/dtos/AdminDTO";

export function toAdminDTO(entity: Admin): AdminDTO {
  try {
    return {
      id: entity.id,
      email: entity.email,
    };
  } catch (error) {
    throw new Error('Something happend in toAdminDTO')
  };
};

