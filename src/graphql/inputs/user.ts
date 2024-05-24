import { Field, InputType } from "type-graphql";

@InputType()
export class UserInput {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  api_token: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  fullName: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  isWhatsapp: boolean;

  @Field({ nullable: true })
  cep: string;

  @Field({ nullable: true })
  address: string;

  @Field({ nullable: true })
  number: string;

  @Field({ nullable: true })
  complement: string;

  @Field({ nullable: true })
  theme: string;

  @Field({ nullable: true })
  cpf: string;

  @Field({ nullable: true })
  cnpj: string;
}