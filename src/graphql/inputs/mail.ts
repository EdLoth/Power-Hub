import { Field, InputType } from "type-graphql";

@InputType()
export class MailInput {
  @Field({ nullable: true })
  id: number; 

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