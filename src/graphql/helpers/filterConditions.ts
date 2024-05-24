import { Prisma } from "@prisma/client";

export async function filterConditions(filter: object) {
  let whereConditions = {};

  try {
    if (typeof filter != "undefined") {
      if (filter["fields"].length > 0 && filter["fields"]) {
        filter["fields"].map(function (item) {
          let { field, operator, value } = item as {
            field: string[] | null;
            value: string[] | null;
            operator: "OR" | "AND" | "NOT" | "LIKE" | "=";
          };
          if (field && operator && value) {
            if (operator.toLowerCase() == "like") {
              field.map(function (f) {
                var key = f.split(".");
                var obj = {};

                if (key.length > 1) {
                  if (key[1] === "id") {
                    throw new Error(
                      "Campo ID não pode fazer busca em outra tabela"
                    );
                  }

                  obj[key[0]] = {
                    [key[1]]: {
                      contains: value[0],
                    },
                  };
                  if (typeof whereConditions["OR"] == "undefined") {
                    whereConditions["OR"] = [];
                  }
                  whereConditions["OR"].push(obj);
                } else {
                  if (typeof whereConditions["OR"] == "undefined") {
                    whereConditions["OR"] = [];
                  }

                  if (value.length > 1) {
                    value.map((i) => {
                      obj[key[0]] = {
                        contains: i,
                      };

                      whereConditions["OR"].push(obj);
                    });
                  } else {
                    obj[key[0]] = {
                      contains: value[0],
                    };
                    if (typeof whereConditions["OR"] == "undefined") {
                      whereConditions["OR"] = [];
                    }
                    whereConditions["OR"].push(obj);
                  }
                }
              });
            } else if (operator.toLowerCase() == "and") {
              field.map(function (key) {
                if (typeof whereConditions[key] == "undefined") {
                  whereConditions[key] = {};
                }

                if (isNaN(parseInt(value[0]))) {
                  whereConditions[key]["in"] = value;
                } else {
                  whereConditions[key]["in"] = value.map((item) => {
                    return parseInt(item);
                  });
                }
              });
            } else if (operator.toLowerCase() == "=") {
              field.map(function (f) {
                try {
                  var key = f.split(".");
                  var obj = {};
                  if (key.length > 1) {
                    if (key[1] === "id") {
                      throw new Error(
                        "Campo ID não pode fazer busca em outra tabela"
                      );
                    }
                    obj[key[0]] = {
                      [key[1]]: value[0],
                    };
                    whereConditions = obj;
                  } else {
                    whereConditions[f] = parseInt(value[0]);
                    if (f === "cpf") {
                      whereConditions[f] = value[0];
                    }
                  }
                } catch (e) {
                  whereConditions[key[0]] = value[0];
                }
              });
            } else if (operator.toLowerCase() == "in") {
              field.map(function (key) {
                if (typeof whereConditions[key] == "undefined") {
                  whereConditions[key] = {};
                }

                if (isNaN(parseInt(value[0]))) {
                  whereConditions[key]["in"] = value;
                } else {
                  whereConditions[key]["in"] = value.map((item) => {
                    return parseInt(item);
                  });
                }
              });
            }
          }
        });
      }

      return whereConditions;
    } else {
      return whereConditions;
    }
  } catch (e) {
    console.log(e);
  }
}

export async function buildSqlQuery(filter: object): Promise<String> {
  if (!filter || !filter["fields"] || filter["fields"].length === 0) {
    return "";
  }

  const sqlConditions = filter["fields"].map((item) => {
    const { field, operator, value } = item as {
      field: string[] | null;
      value: string[] | null;
      operator: "OR" | "AND" | "NOT" | "LIKE" | "=";
    };

    if (field && operator && value) {
      const formattedValue = value.map((v) => formatValue(v)).join(", ");

      if (operator.toLowerCase() === "like") {
        return field
          .map((f) => {
            const key = f.split(".");
            if (key.length > 1 && key[1] === "id") {
              throw new Error("Campo ID não pode fazer busca em outra tabela");
            }
            return key.length > 1
              ? `${key[0]}.${key[1]} LIKE '%${formattedValue}%'`
              : `${key[0]} LIKE '%${formattedValue}%'`;
          })
          .join(" AND ");
      } else if (operator.toLowerCase() === "and") {
        return field
          .map((key) => {
            const formattedKey = isNaN(parseInt(key)) ? key : parseInt(key);
            return `${formattedKey} IN (${formattedValue})`;
          })
          .join(" AND ");
      }
    }

    return "";
  });

  const whereClause = sqlConditions
    .filter((condition) => condition !== "")
    .join(" OR ");
  return whereClause ? ` AND ${whereClause} ` : "";
}

function formatValue(value: any): string {
  if (typeof value === "string") {
    return `${value}`;
  } else if (typeof value === "number") {
    return value.toString();
  } else {
    throw new Error("Unsupported value type.");
  }
}
