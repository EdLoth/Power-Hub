import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class ProductModel {
  @Field(() => String, { nullable: true })
  code: string;

  @Field(() => String, { nullable: true })
  name: string;

  @Field(() => String, { nullable: true })
  description: string;

  @Field(() => Number, { nullable: true })
  stock: number;

  @Field(() => String, { nullable: true })
  supplierId?: string;

  @Field(() => String, { nullable: true })
  brandId?: string;

  @Field(() => Number, { nullable: true })
  price: number;

  @Field(() => String, { nullable: true })
  format?: string;

  @Field(() => Date, { nullable: true })
  expirationDate?: Date;

  @Field(() => Boolean, { nullable: true })
  freeShipping: boolean;

  @Field(() => Number, { nullable: true })
  netWeight?: number;

  @Field(() => Number, { nullable: true })
  grossWeight?: number;

  @Field(() => Number, { nullable: true })
  width?: number;

  @Field(() => Number, { nullable: true })
  height?: number;

  @Field(() => Number, { nullable: true })
  depth?: number;

  @Field(() => Number, { nullable: true })
  volumes?: number;

  @Field(() => Number, { nullable: true })
  itemsPerBox?: number;

  @Field(() => String, { nullable: true })
  unitOfMeasurement?: string;

  @Field(() => Boolean, { nullable: true })
  situation: boolean;

  @Field(() => String, { nullable: true })
  image?: string;
}

