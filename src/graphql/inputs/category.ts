import { Field, InputType } from "type-graphql";

@InputType()
export class CategoryInput {
  @Field(() => String, { nullable: true })
  name: string;
}