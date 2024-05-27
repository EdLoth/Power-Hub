import { Arg, Mutation, Query, Resolver } from "type-graphql";
import bcryptjs from "bcryptjs";
import { UserService } from "../services";
import { UserInput } from "../inputs";
import { UserModel } from "../models";
import { Pagination } from "../inputs";
// import { MailQueue } from "./mail";

@Resolver()
export class UserResolver {
  @Query(() => [UserModel])
  async GetUsuarios(
    @Arg("pagination", () => Pagination, { nullable: true }) pagination: Pagination
  ) {
    const users = await UserService.findManyUsers(pagination);
    return users;
  }

  @Query(() => UserModel)
  async GetUsuarioByID(
    @Arg("id", () => String) id: string
  ) {
    const user = await UserService.findUserByID(id);
    return user;
  }

  async SetUsuario(
    @Arg("usuario", () => UserInput) usuario: UserInput
  ) {
    const userExists = await UserService.emailValid(usuario.email);

    if (userExists.emailValid !== false) {
      throw new Error("Usuario já cadastrado com esse email.");
    }

    const pwd = await bcryptjs.hash(usuario.password, 10);

    const save = await UserService.create(usuario, pwd);

    if (save) {
      // const mailBody = `<p>Olá ${save.fullName} ,</p>
      //   <p>Seja bem-vindo à Poderosa!</p>
      //   <p>A Poderosa é uma empresa de tecnologia que organiza informações territoriais para tomadas de decisões de investimentos imobiliários.</p>
      //   <p>Um abraço. </p>
      //   <p>Equipe Urbit </p>`;

      // const mailSubject = `Seja bem-vindo à Urbit!`;

      // const queue = new MailQueue();

      // const emails = ["rafael.butt@hotmail.com", "rafael@urbit.com.br", "fernando@urbit.com.br", save.email];
      // emails.forEach(email => {
      //   queue.SetMailQueue({
      //     assunto: mailSubject,
      //     corpo: mailBody,
      //     id: 0,
      //     email: email,
      //     data_cadastro: "",
      //     data_envio: "",
      //     situacao_envio: "",
      //     origem: "APP",
      //   });
      // });

      console.log(`Usuário ${save.fullName} criado com sucesso. ID: ${save.id}`);

      return save;
    } else {
      throw new Error("Não foi possível salvar o usuário");
    }
  }

  @Mutation(() => UserModel)
  async PutUsuario(
    @Arg("id", () => String) id: string,
    @Arg("usuario", () => UserInput) usuario: UserInput
  ) {

    const user = await UserService.findUserByID(id);

    if (!user) {
      throw new Error("Usuário não encontrado");
    }

    const update = UserService.update(id, usuario);

    if (update) {

      console.log(`Usuário ${(await update).fullName} criado com sucesso. ID: ${(await update).id}`);

      return update;
    } else {
      throw new Error("Não foi possível salvar o usuário");
    }
  }

  @Mutation(() => UserModel)
  async DeleteUsuario(
    @Arg("id", () => String) id: string
  ) {
    const user = await UserService.findUserByID(id);

    if (!user || user.situacao === true) {
      return { msg: "Usuário não encontrado!" };
    }

    const deleted = await UserService.deleteUser(id);

    if (!deleted) {
      return { msg: "Não foi possivel deletar!" };
    }

    return deleted;
  }
}
