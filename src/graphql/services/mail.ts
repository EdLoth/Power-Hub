import { prisma } from "../../utils/index";
import { MailInput } from "../inputs/mail";


class MailServices {
  async create(data: MailInput) {
    const { assunto,corpo, data_envio, email, origem} = data;

    const mail = await prisma.mail.create({
      data: {
        assunto,corpo,
         data_envio, 
         email, 
         origem,
        situacao_envio: 1,
        data_cadastro: new Date(),
      },
    });

    return mail;
  }

  async list() {
    const mail = await prisma.mail.findMany({
      where: {
        situacao_envio: 1,
      },
    });

    return mail;
  }

  async update(id: number) {
    const mail = await prisma.mail.update({
      where: {
        id,
      },
      data: {
        situacao_envio: 0,
        data_envio: new Date(),
      },
    });

    return mail;
  }
}

export default new MailServices();
