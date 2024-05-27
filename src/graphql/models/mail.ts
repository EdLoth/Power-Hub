import { Field, ID, ObjectType } from "type-graphql";


@ObjectType()
export class MailModel {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  assunto: string;

  @Field(() => String, { nullable: true })
  corpo: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => Date, { nullable: true })
  data_cadastro: Date;

  @Field(() => Date, { nullable: true })
  data_envio: Date;

  @Field(() => String, { nullable: true })
  situacao_envio: string;

  @Field(() => String, { nullable: true })
  origem: string;
}
