import { prisma } from "../../database";
import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 } from "uuid";

import { UserModel } from "../models";
import { UserInput } from "../inputs/";

import {
  adminMiddleware,
  authMiddleware,
} from "../../middleware/auth";
import { trackLogMiddleware } from "../../middleware/trackLog";

import { Context } from "../../context/context";

import {
  UserService,
  TrackLogServices,
  LogAcessosRecursosServices,
} from "../services";
import { mail } from "../../config/nodemailer";
import { address } from "ip";
import { Pagination } from "../inputs/pagination";
import { usuarioLogin } from "../inputs/usuarioLogin";
import { UsuarioLoginModel } from "../models/usuarioLogin";
import { filter } from "../inputs/filter";
import { PageInfo } from "../models/count";
import { UsuariosProdutosModel } from "../models/usuariosProdutos";
import funcionarios from "../services/funcionarios";
import { GraphQLError } from "graphql/error/GraphQLError";


type TrackLog = {
  query: string;
  variables: object;
  operationName: string;
};

@Resolver()
export class Authenticate {

  @UseMiddleware()
  @Mutation(() => UsuarioLoginModel)
  async Login(@Arg("usuario") usuario: usuarioLogin, @Ctx() context: Context) {
    const emailValid = await UserService.emailValid(usuario.email);

    if (!emailValid.emailValid) {
      throw new GraphQLError("Usuário não existe!");
    }

    const passwordValid = await UserService.passwordValid(
      usuario.password,
      emailValid.user.password
    );

    if (!passwordValid) {
      throw new GraphQLError("Senha Inválida!");
    }

    let tipo = await EmpresaUsuarioServices.findByUserId(emailValid.user.id);

    emailValid.user.api_token = jwt.sign(
      {
        name: emailValid.user.name,
        email: emailValid.user.email,
        tipo_usuario: tipo ? tipo.tipo_usuario : "",
        id: emailValid.user.id,
        ip: address(),
      },
      process.env.AUTH_SECRET,
      { expiresIn: "50m" }
    );

    let update = await UserService.updateToken(
      emailValid.user.id,
      emailValid.user.api_token
    );



    let { operationName, query, variables } = context.req.body as TrackLog;
    let plat = "";
    const ip = address();
    let action = query.split(" ")[0];
    for (let item of context.req.rawHeaders) {
      if (item.includes("Dart")) {
        operationName = `${operationName}App`;
      }
    }
    await TrackLogServices.create({
      id_modulo: 1,
      resolver: operationName,
      action,
      data_acesso: new Date().toISOString(),
      param: `${JSON.stringify(variables).split(",")[0]}`+`}}`,
      hash_acesso: emailValid.user.remember_token,
      user_id: emailValid.user.id,
      ip,
    });
    
    // 👇️ Atribui os dados atualizados ao context da API
    let empresaFuncionario = await funcionarios.findFuncionarioEmpresa(
      emailValid.user.id
    );
    let produtos = [];
    let empresa = null;
    let tipo_usuario = null;

    if (empresaFuncionario) {
      let empresaProduto = await funcionarios.findFuncionarioEmpresaProdutos(
        empresaFuncionario.empresa.id
      );
      empresa = empresaFuncionario.empresa;
      produtos = empresaProduto;
      tipo_usuario = empresaFuncionario.tipo_usuario;
    } else {
      produtos = await UsuarioProdutosServices.usuarioProdutosList(
        emailValid.user.id
      );
    }

    console.log(emailValid)
    console.log( emailValid.user.id)
    await LogAcessosRecursosServices.createLog(
      {
        action: "login",
        ferramenta: "login",
        funcionalidade: "login",
        url: "/auth/login",
        hash_acesso: emailValid.user.remember_token  
      },
      emailValid.user.id,
      empresa?.id || undefined,
      ip
    );
    context.user = update;
    context.user.produtos = produtos ? produtos : [];
    context.user.empresa = empresa ? empresa : [];

    return {
      ...emailValid.user,
      empresa: empresa,
      produtos: produtos,
      tipo_usuario: tipo_usuario,
    };
  }


}
