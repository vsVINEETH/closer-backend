import { IAdminDocument } from "../persistence/interfaces/IAdminModel";
import { Admin } from "../../domain/entities/Admin";

export function toAdminEntityFromDoc(doc: IAdminDocument): Admin {
  try {
     return new Admin({ 
      id: doc.id.toString(),
      email: doc.email, 
      password: doc.password 
    });
  } catch (error) {
    throw new Error('Something happend in toAdminEntityFromDoc')
  };
};
