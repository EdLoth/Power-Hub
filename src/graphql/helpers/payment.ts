import moment from "moment";

export class PaymentHelper {
  async calcDataFim(data_inicio: Date, id_periodo: number) {
    switch (id_periodo) {
      // case 1:
      //   return moment(data_inicio).add(1, "month").format("YYYY-MM-DD");
      // case 4:
      //   return moment(data_inicio).add(6, "months").format("YYYY-MM-DD");
      case 2:
        return moment(data_inicio).add(1, "month").format("YYYY-MM-DD");
      case 3:
        return moment(data_inicio).add(3, "months").format("YYYY-MM-DD");
      case 5:
        return moment(data_inicio).add(1, "year").format("YYYY-MM-DD");
      default:
        return moment(data_inicio).add(1, "month").format("YYYY-MM-DD");
    }
  }
}
