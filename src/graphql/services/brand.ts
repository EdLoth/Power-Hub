import { PrismaClient } from '@prisma/client';
import { Pagination, BrandInput } from '../inputs';

const prisma = new PrismaClient();

 class BrandService {
  
  async findManyBrands(pagination: Pagination){
    let pagina: number = 0;
    let quantidade: number = 10;

    if (pagination) {
      pagina = !pagination.pagina ? 0 : pagination.pagina;
      quantidade = !pagination.quantidade ? 10 : pagination.quantidade;
    }

    const brands = await prisma.marca.findMany({
      skip: pagina * quantidade || 0,
      take: quantidade || 10,
      orderBy: {
        id: "desc",
      },
    });

    return brands;
  }

  async createBrand(brandInput: BrandInput) {
    const {name} = brandInput;
    return await prisma.marca.create({
      data: {
        name
      }
    });
  }


  async getBrandById(id: string) {
    return await prisma.marca.findUnique({
      where: { id },
    });
  }

  async updateBrand(id: string, brandInput: BrandInput) {
    const {name} = brandInput;

    return await prisma.marca.update({
      where: { id },
      data: {
        name
      }
    });
  }

  async deleteBrand(id: string) {
    return await prisma.marca.delete({
      where: { id },
    });
  }
}
export default new BrandService();