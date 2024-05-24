import { Request, Response } from "express";

export interface Context {
  req: Request;
  res: Response;
  user: {
    remember_token: any;
    id: number;
    api_token?: string;
    corporate?: {
      hasCorporate: boolean;
      employees?: any[];
      employeesEdit?: any[];
      employeesDelete?: any[];
    };
    profile?: {
      id: number;
      profile: string;
    };

    api_token_api_gis?: string;
    produtos?: any[];
    empresa_usuario: any;
    user_produto: any[];
    empresa?: {
      id: number;
      nome: string;
      user_logo_pic: string;
      cor_fonte: string;
      cor_background: string;
      cep: string;
      bairro: string;
      cnpj: string;
      complemento: string;
      email: string;
      endereco: string;
      estado: string;
      nome_fantasia: string;
      numero: string;
      telefone: string;
    };
  };
  corporate: {
    hasCorporate: boolean;
    employees: number[];
    employeesEdit?: number[];
    employeesDelete?: number[];
  };
}
