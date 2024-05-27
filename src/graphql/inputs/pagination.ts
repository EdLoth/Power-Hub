import { Field, InputType } from "type-graphql";

@InputType()
export class Pagination {
  @Field(() => Number, { nullable: true })
  quantidade: number | null;

  @Field(() => Number, { nullable: true })
  pagina: number | null;
}
