import { Field, InputType } from "type-graphql";

@InputType()
export class BrandInput {
  @Field(() => String, { nullable: true })
  name: string;
}