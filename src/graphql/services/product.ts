import { PrismaClient, Produto } from '@prisma/client';
import { Pagination, ProductInput } from '../inputs';
const prisma = new PrismaClient();

 class ProductService {
  async findManyProducts(pagination: Pagination) {
    return await prisma.produto.findMany();
  }

  async createProduto(data: any) {
    return await prisma.produto.create({
      data,
    });
  }

  
  async getProdutoById(id: string) {
    return await prisma.produto.findUnique({
      where: { id },
    });
  }

  async updateProduto(id: string, productInput: ProductInput) {
    return await prisma.produto.update({
      where: { id },
      data:{
        ...productInput
      },
    });
  }

  async deleteProduto(id: string) {
    return await prisma.produto.delete({
      where: { id },
    });
  }
}
export default new ProductService();