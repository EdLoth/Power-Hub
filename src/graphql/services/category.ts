import { PrismaClient } from '@prisma/client';
import { CategoryInput, Pagination } from '../inputs';

const prisma = new PrismaClient();

 class CategoryService {
  async findManyCategories(pagination: Pagination){
    return await prisma.categoria.findMany();
  }

  async createCategory(categoryInput: CategoryInput) {
    const {name} = categoryInput
    return await prisma.categoria.create({
      data: {
        name
      }
    });
  }


  async getCategoryById(id: string) {
    return await prisma.categoria.findUnique({
      where: { id },
    });
  }

  async updateCategory(id: string, categoryInput: CategoryInput) {
    const { name } = categoryInput;
    return await prisma.categoria.update({
      where: { id },
      data: {
        name
      }
    });
  }

  async deleteCategory(id: string) {
    return await prisma.categoria.delete({
      where: { id },
    });
  }
}
export default new CategoryService();