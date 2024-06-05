import { Field, InputType } from "type-graphql";

@InputType()
export class AdministratorInput {
  @Field(() => String, { nullable: true })
  id?: string;

  @Field(() => String, { nullable: true })
  api_token?: string;

  @Field(() => String)
  name: string;

  @Field(() => String)
  email: string;

  @Field(() => String)
  password: string;

  @Field(() => String)
  role: string;

  @Field(() => Boolean)
  situacao: boolean;

  @Field(() => String)
  phone: string;

  @Field(() => Boolean, { nullable: true }) 
  isWhatsapp?: boolean;

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
