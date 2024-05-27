import { Produto } from '@prisma/client';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { ProductService } from '../services';
import { ProductModel } from '../models';
import { Pagination, ProductInput } from '../inputs';
import { ApolloError } from 'apollo-server';


@Resolver()
export class ProductResolver {
  @Query(() => [ProductModel])
  async GetProdutos(
    @Arg("pagination", () => Pagination, { nullable: true }) pagination: Pagination
  ) {
    const producst = await ProductService.findManyProducts(pagination)
  }

  @Query(() => ProductModel, { nullable: true })
  async GetProdutoById(
    @Arg("id", () => String) id: string
  ) {
    return await ProductService.getProdutoById(id);
  }

  @Mutation(() => ProductModel)
  async CreateProduto(
    @Arg("produto", () => ProductInput) produto: ProductInput
  ) {
    return await ProductService.createProduto(produto);
  }

  @Mutation(() => ProductModel, { nullable: true })
  async UpdateProduto(
    @Arg("id", () => String) id: string,
    @Arg("produto", () => ProductInput) produto: ProductInput
  ) {
    const product = await ProductService.getProdutoById(id);

    if (!product) {
      throw new ApolloError("Nenhum produto encontrado com este identificador", "NO_CONTENT");
    }

    // Retorna o produto atualizado apenas se ele existir
    return await ProductService.updateProduto(id, produto);
  }
  @Mutation(() => ProductModel, { nullable: true })
  async DeleteProduto(
    @Arg("id", () => String) id: string
  ) {
    return await ProductService.deleteProduto(id);
  }
}
