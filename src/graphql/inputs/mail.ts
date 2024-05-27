import { Field, InputType } from "type-graphql";

@InputType()
export class MailInput {
  @Field(() => Number, { nullable: true })
  id: number; 

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
