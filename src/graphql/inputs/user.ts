import { Field, InputType } from "type-graphql";

@InputType()
export class UserInput {
  @Field({ nullable: true })
  id: string;

  @Field()
  password: string;

  @Field()
  fullName: string;

  @Field()
  email: string;

  @Field()
  phone: string;

  @Field({ nullable: true })
  isWhatsapp?: boolean;

  @Field({ nullable: true })
  api_token?: string;

  @Field({ nullable: true })
  theme?: string;

  @Field({ nullable: true })
  cep?: string;

  @Field({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  number?: string;

  @Field({ nullable: true })
  complement?: string;

  @Field({ nullable: true })
  cpf?: string;

  @Field({ nullable: true })
  cnpj?: string;

  @Field()
  situacao: boolean;

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  deleted_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
