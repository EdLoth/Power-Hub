import {
  Arg,
  Mutation,
  Query,
  Resolver
} from "type-graphql";


import { MailServices } from '../services'
import { MailModel } from "../models";
import { MailInput } from "../inputs";

@Resolver()
export class MailQueue {
  @Query(() => [MailModel])
  async GetMailQueue() {
    return await MailServices.list();
  }

  @Mutation(() => MailModel)
  async SetMailQueue(
    @Arg("data", () => MailInput) data: MailInput
  ) {
    delete data.data_cadastro;
    delete data.data_envio;
    delete data.situacao_envio;
    delete data.id;

    return await MailServices.create(data);
  }

  @Mutation(() => MailModel)
  async PutMailQueue(
    @Arg("id", () => Number) id: number
  ) {
    return await MailServices.update(id);
  }
}
