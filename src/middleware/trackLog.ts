import { MiddlewareFn } from "type-graphql";
import { Context } from "../context/context";

import { address } from "ip";

import { TrackLogServices } from "../graphql/services/";

import jwt from "jsonwebtoken";

export const trackLogMiddleware: MiddlewareFn<Context> = async (
  { context },
  next,
) => {
  type TrackLog = {
    query: string;
    variables: object;
    operationName: string;
  };

  type TokenData = {
    id: number;
  };

  const { authorization } = context.req.headers;
  let { operationName, query, variables } = context.req.body as TrackLog;
  let action = query.split(" ")[0];
  const ip = address();

  try {
    let plat = "";

    for (let item of context.req.rawHeaders) {
      if (item.includes("Dart")) {
        operationName = `${operationName}App`;
      }
    }

    if (!authorization) {
      const data = {
        id_modulo: 1,
        resolver: operationName,
        action,
        data_acesso: new Date().toISOString(),
        param: JSON.stringify(variables),
        hash_acesso: undefined,
        user_id: undefined,
        ip,
      };

      TrackLogServices.create(data);

      return next();
    } else {
      const TokenPayload = jwt.verify(
        authorization.split(" ")[1],
        process.env.AUTH_SECRET,
      );

      const { id } = TokenPayload as TokenData;

      context.req.userId = id;

      const data = {
        id_modulo: 1,
        resolver: operationName,
        action,
        data_acesso: new Date().toISOString(),
        param: JSON.stringify(variables),
        hash_acesso: authorization.split(" ")[1],
        user_id: id,
        ip,
      };

      TrackLogServices.create(data);

      return next();
    }
  } catch (e) {
    const data = {
      id_modulo: 1,
      resolver: operationName,
      action,
      data_acesso: new Date().toISOString(),
      param: JSON.stringify(variables),
      hash_acesso: undefined,
      user_id: undefined,
      ip,
    };

    TrackLogServices.create(data);

    return next();

  }
};
