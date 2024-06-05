import getPageInfo from "../../helpers/getPageInfo";
import { prisma } from "../../database/index";
import { log_acessos } from "../inputs/log_acessos";
import { Pagination } from "../inputs/pagination";
import { filterConditions } from "../../helpers/filterConditions";

class LogAcessos {
  async createLog(
    data: log_acessos,
    user_id: number,
    id_empresa: number | undefined,
    ip: string,
  ) {
    return await prisma.log_acesso_recursos.create({
      data: {
        users: { connect: { id: user_id } },
        id_empresa: id_empresa === undefined ? null : id_empresa,
        ip: ip,
        data_acesso: new Date(),
        ...data,
      },
    });
  }

  async getLog(pagination: Pagination, user_id: number) {
    let pagina: number = 0;
    let quantidade: number = 10;

    if (pagination) {
      pagina = !pagination.pagina ? 0 : pagination.pagina;
      quantidade = !pagination.quantidade ? 10 : pagination.quantidade;
    }

    const find = await prisma.log_acesso_recursos.findMany({
      where: { user_id },
      skip: pagina * quantidade || 0,
      take: quantidade || 10,
      orderBy: {
        id: "desc",
      },
    });

    const dataTotal = await prisma.log_acesso_recursos.count({
      where: { user_id },
    });

    const pageinfo = getPageInfo(dataTotal, pagina, quantidade);

    return { result: find, pageInfo: pageinfo };
  }

  async getLogEmpresa(
    pagination: Pagination,
    id_empresa: number,
    filtro,
    datas,
  ) {
    let pagina: number = 0;
    let quantidade: number = 10;
    let whereConditions;

    if (datas["data_inicio"] !== null || datas["data_fim"] !== null) {
      const whereDate = {
        gte: new Date(`${datas.data_inicio} 00:00:00`),
        lte: new Date(`${datas.data_fim} 23:59:59`),
      };

      let filterResult;
      if (pagination) {
        pagina = !pagination.pagina ? 0 : pagination.pagina;
        quantidade = !pagination.quantidade ? 10 : pagination.quantidade;
      }

      filterResult = await filterConditions(filtro);
      whereConditions = {
        id_empresa,
        data_acesso: {
          ...whereDate,
        },
        ...filterResult,
        ...whereConditions,
      };

      const find = await prisma.log_acesso_recursos.findMany({
        where: whereConditions,
        skip: pagina * quantidade || 0,
        take: quantidade || 10,
        orderBy: {
          id: "desc",
        },
      });

      const dataTotal = await prisma.log_acesso_recursos.count({
        where: whereConditions,
      });

      const pageinfo = getPageInfo(dataTotal, pagina, quantidade);

      return { result: find, pageInfo: pageinfo };
    } else if (datas["data_inicio"] !== null && datas["data_fim"] === null) {
      const whereDate = {
        gte: new Date(`${datas.data_inicio} 00:00:00`),
        lte: new Date(),
      };

      let filterResult;
      if (pagination) {
        pagina = !pagination.pagina ? 0 : pagination.pagina;
        quantidade = !pagination.quantidade ? 10 : pagination.quantidade;
      }

      filterResult = await filterConditions(filtro);
      whereConditions = {
        id_empresa,
        data_acesso: {
          ...whereDate,
        },
        ...filterResult,
        ...whereConditions,
      };

      const find = await prisma.log_acesso_recursos.findMany({
        where: whereConditions,
        skip: pagina * quantidade || 0,
        take: quantidade || 10,
        orderBy: {
          id: "desc",
        },
      });

      const dataTotal = await prisma.log_acesso_recursos.count({
        where: whereConditions,
      });

      const pageinfo = getPageInfo(dataTotal, pagina, quantidade);

      return { result: find, pageInfo: pageinfo };
    }

    if (pagination) {
      pagina = !pagination.pagina ? 0 : pagination.pagina;
      quantidade = !pagination.quantidade ? 10 : pagination.quantidade;
    }

    let filterResult = await filterConditions(filtro);

    whereConditions = {
      id_empresa,
      ...filterResult,
      ...whereConditions,
    };

    const find = await prisma.log_acesso_recursos.findMany({
      where: whereConditions,
      skip: pagina * quantidade || 0,
      take: quantidade || 10,
      orderBy: {
        id: "desc",
      },
    });

    const dataTotal = await prisma.log_acesso_recursos.count({
      where: whereConditions,
    });

    const pageinfo = getPageInfo(dataTotal, pagina, quantidade);

    return { result: find, pageInfo: pageinfo };
  }
}

export default new LogAcessos();
