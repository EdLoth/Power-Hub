import { Field, InputType } from "type-graphql";

@InputType()
export class AdministratorInput {
  @Field({ nullable: true })
  id: string;

  @Field({ nullable: true })
  api_token?: string;

  @Field({ nullable: true })
  name: string;

  @Field({ nullable: true })
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ nullable: true })
  role: string;

  @Field({ nullable: true })
  situacao: boolean;

  @Field({ nullable: true })
  phone: string;

  @Field({ nullable: true })
  cpf?: string;

  @Field({ nullable: true })
  cnpj?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field({ nullable: true })
  created_at?: Date;

  @Field({ nullable: true })
  deleted_at?: Date;

  @Field({ nullable: true })
  updated_at?: Date;
}
