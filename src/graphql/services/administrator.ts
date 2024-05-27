import bcryptjs from "bcryptjs";
import { prisma } from "src/utils";
import { AdministratorInput } from "../inputs/administrator";


class AdministratorService {
  async emailValid(email: string) {
    const user = await prisma.user.findFirst({
      where: { email, situacao: true },
    });

    if (!user) {
      return { emailValid: false };
    }

    return { emailValid: true, user: user };
  }

  async passwordValid(password: string, hashPassword: string) {
    const isValid = await bcryptjs.compare(password, hashPassword);

    if (!isValid) {
      return false;
    } else {
      return true;
    }
  }

  async findAdminByID(id: string) {
    const user = await prisma.user.findFirst({
      where: { id, situacao: true }
    });
    return user;
  }

  async createAdmin(adminInput: AdministratorInput, password: string) {
    const { email,cpf, cnpj, name, dateOfBirth, role, phone  } = adminInput;

    const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = await prisma.administrator.create({
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
      },
    });
    return admin;
  }

  async updateAdmin(adminId: string, adminInput: AdministratorInput) {

    const { name, email, phone, cpf, cnpj, situacao, role } = adminInput;
    const admin = await prisma.administrator.update({
      where: {
        id: adminId,
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
    const admin = await prisma.administrator.findFirst({
      where: {
        id,
      }
    })

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