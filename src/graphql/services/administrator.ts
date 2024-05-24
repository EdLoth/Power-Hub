

class AdministratorService {
  async emailValid(email: string) {
    const user = await prisma.users.findFirst({
      where: { email, situacao: 1 },
      include: {
        profile: true,
        empresa_usuario: true,
      },
    });

    if (!user) {
      return { emailValid: false };
    }

    return { emailValid: true, user: user };
  }
}

export default new AdministratorService();