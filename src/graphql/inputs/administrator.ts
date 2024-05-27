import { Field, InputType } from "type-graphql";

@InputType()
export class AdministratorInput {
  @Field(() => String, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  api_token?: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  email: string;

  @Field(() => String, { nullable: true })
  password: string;

  @Field(() => String, { nullable: true })
  role: string;

  @Field(() => Boolean, { nullable: true })
  situacao: boolean;

  @Field(() => String, { nullable: true })
  phone: string;

  @Field(() => String, { nullable: true })
  cpf?: string;

  @Field(() => String, { nullable: true })
  cnpj?: string;

  @Field(() => Date, { nullable: true })
  dateOfBirth?: Date;

  @Field(() => Date, { nullable: true })
  created_at?: Date;

  @Field(() => Date, { nullable: true })
  deleted_at?: Date;

  @Field(() => Date, { nullable: true })
  updated_at?: Date;
}
