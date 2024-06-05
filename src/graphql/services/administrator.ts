import bcryptjs from "bcryptjs";
import { prisma } from "src/utils";
import { TypePerson } from "../models"; // Certifique-se de importar os modelos corretamente
import { AdministratorInput } from "../inputs/administrator";

class AdministratorService {
  async emailValid(email: string) {
    const user = await prisma.user.findFirst({
      where: { email, situacao: true, type_person: TypePerson.ADMIN }, // Adicione o filtro para tipo de pessoa ADMIN
    });

    if (!user) {
      return { emailValid: false };
    }

    return { emailValid: true, user: user };
  }

  async passwordValid(password: string, hashPassword: string) {
    const isValid = await bcryptjs.compare(password, hashPassword);

    return isValid; // A comparação já retorna true ou false, então não é necessário fazer outro if
  }

  async findAdminByID(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, situacao: true, type_person: TypePerson.ADMIN }, // Adicione o filtro para tipo de pessoa ADMIN
    });
    return user;
  }

  async createAdmin(adminInput: AdministratorInput, password: string) {
    const { email, cpf, cnpj, name, dateOfBirth, role, phone, isWhatsapp } = adminInput;

    const hashedPassword = await bcryptjs.hash(password, 10);

    // Adicione isWhatsapp ao objeto de dados, se disponível
    const admin = await prisma.user.create({
      data: {
        password: hashedPassword,
        name,
        email,
        phone,
        cpf,
        cnpj,
        dateOfBirth,
        role,
        situacao: true,
        type_person: TypePerson.ADMIN,
        isWhatsapp, // Inclua isWhatsapp se estiver disponível
      },
    });
    return admin;
  }

  async updateAdmin(adminId: string, adminInput: AdministratorInput) {
    const { name, email, phone, cpf, cnpj, situacao, role } = adminInput;
    const admin = await prisma.user.update({
      where: {
        id: adminId,
        type_person: TypePerson.ADMIN, // Adicione a condição para garantir que seja um administrador
      },
      data: {
        name,
        email,
        phone,
        cpf,
        cnpj,
        role,
        situacao,
        updated_at: new Date(),
      },
    });

    return admin;
  }

  async deleteAdmin(id: string) {
    const admin = await prisma.user.findFirst({
      where: {
        id,
        type_person: TypePerson.ADMIN, // Adicione a condição para garantir que seja um administrador
      },
    });

    const deleted = await prisma.user.update({
      where: { id },
      data: {
        deleted_at: new Date(),
        email: `deleted${admin.email}`,
        situacao: false,
      },
    });

    return deleted;
  }
}

export default new AdministratorService();
