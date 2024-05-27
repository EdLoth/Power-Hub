import { Arg, Mutation, Query, Resolver } from 'type-graphql';
import { CategoryService } from '../services';
import { CategoryInput, Pagination } from '../inputs';
import { CategoryModel } from '../models';

@Resolver()
export class CategoryResolver {
  @Query(() => [CategoryModel])
  async GetCategorias(
    @Arg("pagination", () => Pagination, { nullable: true }) pagination: Pagination
  ) {
    const categories = await CategoryService.findManyCategories(pagination);
    return categories;
  }

  @Query(() => CategoryModel, { nullable: true })
  async GetCategoriaByID(
    @Arg("id", () => String) id: string
  ) {
    return await CategoryService.getCategoryById(id);
  }

  @Mutation(() => CategoryModel)
  async SetCategoria(
    @Arg("categoria", () => CategoryInput) categoria: CategoryInput
  ) {
    return await CategoryService.createCategory(categoria);
  }

  @Mutation(() => CategoryModel, { nullable: true })
  async UpdateCategory(
    @Arg("id", () => String) id: string,
     @Arg("categoria", () => CategoryInput) categoria: CategoryInput
    ) {
    return await CategoryService.updateCategory(id, categoria);
  }

  @Mutation(() => CategoryModel, { nullable: true })
  async DeleteCategory(
    @Arg("id", () => String) id: string
  ) {
    return await CategoryService.deleteCategory(id);
  }
}
