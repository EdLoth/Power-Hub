import { Request, Response } from "express";

export interface Context {
  req: Request;
  res: Response;
  user: {
    id: string;
    api_token?: string | null;
    name: string;
    email: string;
    password: string;
    role: string;
    phone: string;
    cpf?: string | null;
    cnpj?: string | null;
    dateOfBirth?: Date | null;
    situacao: boolean;
    isWhatsapp: boolean;
    cep?: string | null;
    address?: string | null;
    number?: string | null;
    complement?: string | null;
    theme?: string | null;
    created_at: Date;
    deleted_at?: Date | null;
    updated_at: Date;
    type_person: "USER" | "ADMIN" | "EMPLOYEE" | "MANAGER";
  };
}
