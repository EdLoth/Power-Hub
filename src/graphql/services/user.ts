import { prisma } from "src/utils";
import bcryptjs from "bcryptjs";
import { UserInput } from "../inputs/user";
import { Pagination } from "../inputs/pagination";


class UserService {
  async emailValid(email: string) {
    const user = await prisma.user.findFirst({
      where: { email, situacao: true }
    });

    return { emailValid: !!user, user };
  }

  async passwordValid(password: string, hashPassword: string) {
    return await bcryptjs.compare(password, hashPassword);
  }

  async findManyUsers(pagination: Pagination) {
    let pagina: number = 0;
    let quantidade: number = 10;

    if (pagination) {
      pagina = !pagination.pagina ? 0 : pagination.pagina;
      quantidade = !pagination.quantidade ? 10 : pagination.quantidade;
    }


    const users = await prisma.user.findMany({
      skip: pagina * quantidade || 0,
      take: quantidade || 10,
      orderBy: {
        id: "desc",
      },
    });



    return users;
  }

  async findUserByID(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, situacao: true }
    });
    return user;
  }

  async create(userInput: UserInput, password: string) {
    const { fullName, email, phone, cpf, cnpj, isWhatsapp } = userInput;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        fullName,
        email,
        phone,
        cpf,
        cnpj,
        isWhatsapp,
        situacao: true,
      },
    });
    return user;
  }

  async update(userId: string, userInput: UserInput) {

    const { fullName, email, phone, cpf, cnpj, isWhatsapp, situacao, address, cep, complement, number, theme } = userInput;
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        fullName,
        email,
        phone,
        cpf,
        cnpj,
        isWhatsapp,
        situacao,
        address,
        cep,
        updated_at: new Date(),
        complement,
        number,
        theme
      },
    });

    return user;
  }

  async deleteUser(id: string) {
    const user = await prisma.user.findFirst({
      where: {
        id,
      }
    })

    const deleted = await prisma.user.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        email: `deleted${user.email}`,
        situacao: false,
      },
    });

    return deleted;
  }
}

export default new UserService();
