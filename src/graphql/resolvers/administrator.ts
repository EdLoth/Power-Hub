import { Arg, Mutation, Resolver } from "type-graphql";
import { AdministratorInput } from "../inputs/administrator";
import { AdministratorModel } from "../models/administrator";
import { AdministratorService } from "../services";
import bcryptjs from "bcryptjs";

@Resolver()
export class UserResolver {
  @Mutation(() => AdministratorModel)
  async SetUsuarioAdmin(
    @Arg("administador") administador: AdministratorInput,
  ) {
 
    const adminExists = await AdministratorService.emailValid(administador.email);

    if (adminExists.emailValid !== false) {
      throw new Error("Usuario já cadastrado com esse email.");
    }
    const pass = Math.random().toString(36).slice(-10);
    const pwd = await bcryptjs.hash(pass, 10);
    const uuid = v4();

    const save = await AdministratorService.create(usuario, pwd, uuid);

    if (save) {
      const empresa = await EmpresaUsuarioServices.create({
        id_empresa: context.user.empresa_usuario[0].id_empresa,
        id_user: save.id,
        edicao: usuario.edicao,
        exclusao: usuario.exclusao,
        visualizacao: usuario.visualizacao,
      });


      return save;
    } else {
      throw new Error("Não foi possivel salvar o usuario");
    }
  }
}