import { AdminDocument } from "../persistence/interfaces/IAdminModel";
import { Admin } from "../../domain/entities/Admin";

export function toAdminEntityFromDoc(doc: AdminDocument): Admin {
  return new Admin({ id: doc.id.toString(), email: doc.email, password: doc.password });
};

