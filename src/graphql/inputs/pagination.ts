import { Field, InputType } from "type-graphql";

@InputType()
export class Pagination {
  @Field({ nullable: true })
  quantidade: number | null;

  @Field({ nullable: true })
  pagina: number | null;
}
