import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { BrandService } from '../services';
import { BrandInput, Pagination } from '../inputs';
import { BrandModel } from '../models';
import { ApolloError } from 'apollo-server';

@Resolver()
export class BrandResolver {
  @Query(() => [BrandModel])
  async GetMarcas(
    @Arg("pagination", () => Pagination, { nullable: true }) pagination: Pagination
  ) {
    const brands = await BrandService.findManyBrands(pagination);
    return brands;
  }

  @Query(() => BrandModel, { nullable: true })
  async GetMarcaByID(
    @Arg("id", () => String) id: string
  ) {
    const brand = await BrandService.getBrandById(id);

    if (!brand) {
      throw new ApolloError("Nenhuma marca encontrada com este identificador", "NO_CONTENT");
    }

    return brand;
  }

  @Mutation(() => BrandModel)
  async SetMarca(
    @Arg("marca", () => BrandInput) marca: BrandInput
  ) {
    return await BrandService.createBrand(marca);
  }

  @Mutation(() => BrandModel, { nullable: true })
  async UpdateBrand(
    @Arg("id", () => String) id: string,
    @Arg("marca", () => BrandInput) marca: BrandInput
  ) {
    const brand = await BrandService.getBrandById(id);

    if (!brand) {
      throw new ApolloError("Nenhuma marca encontrada com este identificador", "NO_CONTENT");
    }

    return await BrandService.updateBrand(id, marca);
  }

  @Mutation(() => BrandModel, { nullable: true })
  async DeleteBrand(
    @Arg("id", () => String) id: string
  ) {
    return await BrandService.deleteBrand(id);
  }
}
