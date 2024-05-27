import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class AdministratorModel {
  @Field()
  id: string;

  @Field()
  api_token: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  role: string;

  @Field()
  situacao: boolean;

  @Field()
  phone: string;

  @Field({ nullable: true })
  cpf?: string;

  @Field({ nullable: true })
  cnpj?: string;

  @Field({ nullable: true })
  dateOfBirth?: Date;

  @Field()
  created_at: Date;

  @Field({ nullable: true })
  deleted_at?: Date;

  @Field()
  updated_at: Date;
}
