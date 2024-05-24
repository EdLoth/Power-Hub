import moment from "moment";

export async function formartDate(data: string): Promise<String> {
  const regexBR = /^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/;
  const regexBRComTraco = /^(\d{2})-(\d{2})-(\d{4}) (\d{2}):(\d{2})$/;
  const regexUS = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2})$/;

  if (typeof data !== "string") {
    throw new Error("Formato de data inválido. Esperado uma string.");
  }

  if (regexBR.test(data)) {
    const [, dia, mes, ano, hora,min] = data.match(regexBR)!;
    return `${ano}-${mes}-${dia} ${hora}:${min}:00`;
  }

  if (regexBRComTraco.test(data)) {
    const [, dia, mes, ano, hora,min] = data.match(regexBRComTraco)!;
    return `${ano}-${mes}-${dia} ${hora}:${min}:00`;
  }

  if (regexUS.test(data)) {
    const [, ano, mes, dia, hora,min] = data.match(regexUS)!;
    return `${ano}-${mes}-${dia} ${hora}:${min}:00`;
  }

  return null;
}
