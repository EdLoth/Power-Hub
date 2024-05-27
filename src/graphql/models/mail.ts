import { Field, ObjectType } from "type-graphql";


@ObjectType()
export class MailModel {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  assunto: string;

  @Field({ nullable: true })
  corpo: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  data_cadastro: string;

  @Field({ nullable: true })
  data_envio: string;

  @Field({ nullable: true })
  situacao_envio: string;

  @Field({ nullable: true })
  origem: string;
}
