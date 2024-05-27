import { Arg, Mutation, Resolver } from "type-graphql";
import { AdministratorInput } from "../inputs";
import { AdministratorModel } from "../models";
import { AdministratorService } from "../services";
import bcryptjs from "bcryptjs";

@Resolver()
export class AdministratorResolver {
  @Mutation(() => AdministratorModel)
  async SetUsuarioAdmin(
    @Arg("administador", () => AdministratorInput) administador: AdministratorInput
  ) {
 
    const adminExists = await AdministratorService.emailValid(administador.email);

    if (adminExists.emailValid !== false) {
      throw new Error("Usuario já cadastrado com esse email.");
    }
    const pass = Math.random().toString(36).slice(-10);
    const pwd = await bcryptjs.hash(pass, 10);

    const save = await AdministratorService.createAdmin(administador, pwd);

    if (save) {

      return save;
    } else {
      throw new Error("Não foi possivel salvar o usuario");
    }
  }
}