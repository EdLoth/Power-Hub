import { prisma } from "src/utils";

type TrackLog = {
  id_modulo: number;
  resolver: string;
  action: string;
  data_acesso: string;
  param: string;
  hash_acesso: string | null;
  user_id: number | null;
  ip: string;
};

class TrackLogServices {
  async create(data: object) {
    const {
      id_modulo,
      resolver,
      action,
      data_acesso,
      param,
      hash_acesso,
      user_id,
      ip,
    } = data as TrackLog;

    const save = await prisma.track_log.create({
      data: {
        id_modulo,
        resolver,
        action,
        data_acesso,
        param,
        hash_acesso,
        user_id,
        ip,
      },
    });
  }
}

export default new TrackLogServices();
