import { Admin } from "../../domain/entities/Admin";

export interface AdminDTO {
    id: string;
    email: string;
}

export interface AdminRepoDTO {
    id: string;
    email: string;
    password: string;
}

export type  AdminLogDTO = { admin: Admin | null, tokens: { accessToken: string, refreshToken: string } | null }