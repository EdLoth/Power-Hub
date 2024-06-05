import { prisma } from "src/utils";
import bcryptjs from "bcryptjs";
import { UserInput } from "../inputs/user";
import { Pagination } from "../inputs";
import { TypePerson } from "../models";

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
    const { name, email, phone, cpf, cnpj, isWhatsapp, cep, address, number, complement, theme, dateOfBirth, type_person, role } = userInput;
  
    const hashedPassword = await bcryptjs.hash(password, 10);
  
    const user = await prisma.user.create({
      data: {
        password: hashedPassword,
        name,
        email,
        phone,
        cpf,
        cnpj,
        dateOfBirth,
        situacao: true,
        isWhatsapp,
        cep,
        address,
        number,
        complement,
        theme,
        role,
        created_at: new Date(),
        type_person, // Agora o tipo de pessoa é recebido como parte do userInput
      },
    });
    return user;
  }
  

  async update(userId: string, userInput: UserInput) {
    const { name, email, phone, cpf, cnpj, isWhatsapp, situacao, address, cep, complement, number, theme } = userInput;
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name,
        email,
        phone,
        cpf,
        cnpj,
        isWhatsapp,
        situacao,
        address,
        cep,
        complement,
        number,
        theme,
        updated_at: new Date(),
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
