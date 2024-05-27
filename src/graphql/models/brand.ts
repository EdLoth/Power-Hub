import { Field, ID, ObjectType } from "type-graphql";

@ObjectType()
export class BrandModel {
  @Field(() => ID, { nullable: true })
  id: string;

  @Field(() => String, { nullable: true })
  name: string;
}