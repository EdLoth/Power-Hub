import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class UserModel {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  fullName: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => Boolean, { nullable: true })
  isWhatsapp?: boolean;

  @Field(() => String, { nullable: true })
  api_token?: string;

  @Field(() => String, { nullable: true })
  theme?: string;

  @Field(() => String, { nullable: true })
  cep?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  number?: string;

  @Field(() => String, { nullable: true })
  complement?: string;

  @Field(() => String, { nullable: true })
  cpf?: string;

  @Field(() => String, { nullable: true })
  cnpj?: string;

  @Field(() => Boolean, { nullable: true })
  situacao: boolean;

  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

  @Field(() => Date, { nullable: true })
  updated_at?: Date;
}
