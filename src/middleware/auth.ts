import { MiddlewareFn } from "type-graphql";
import jwt from "jsonwebtoken";
import { address } from "ip";
import { Context } from "../context/context";
import { UserService } from "../graphql/services";

interface TokenPayload {
  id: string;
  ip: string;
  iat: number;
  exp: number;
}

export const authMiddleware: MiddlewareFn<Context> = async (
  { context },
  next,
) => {
  let token = "";

  for (let item of context.req.rawHeaders) {
    if (item.includes("Bearer")) {
      token = item.split(" ")[1];
    }
  }

  if (token === "") {
    throw new Error("Need a token");
  }

  try {
    const data = jwt.verify(token, process.env.AUTH_SECRET);
    const nowIp = address();
    const { id, ip } = data as TokenPayload;

    const usuario = await UserService.findUserByID(id);

    if (!usuario) {
      throw new Error("Usuário não encontrado");
    }

    if (nowIp !== ip) {
      throw new Error("Ip's are different");
    }

    context.user = usuario;
    context.user["ip"] = nowIp;

    return next();
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export const adminMiddleware: MiddlewareFn<Context> = async (
  { context },
  next,
) => {
  const { user } = context;

  if (!user) {
    throw new Error("Need a token");
  }

  if (user.type_person !== "ADMIN") {
    throw new Error("User is not an administrator");
  }

  return next();
};