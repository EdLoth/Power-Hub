import { ProdutosServices } from "../graphql/services";

type PedidoItem = {
  id_produto: number;
  total: number;
  qtde_itens: number;
  desconto: number;
};

export class PedidoCalcHelper {
  async calcCartValores(pedido: PedidoItem) {
    const produtos = await ProdutosServices.findOne(pedido.id_produto);

    let total = 0;
    total += produtos.valor * pedido.qtde_itens;
    return total;
  }

  async calcTotal(pedido: PedidoItem) {
    const produtos = await ProdutosServices.findOne(pedido.id_produto);

    let total = 0;
    total += produtos.valor * pedido.qtde_itens;
    return total;
  }

  async calcTotalDesconto(pedido: PedidoItem) {
    const produtos = await ProdutosServices.findOne(pedido.id_produto);

    switch (pedido.desconto) {
      case 0:
        return {
          total: produtos.valor,
          id_produto_periodo: 1,
          desconto: 0,
          hash: produtos.uuid,
        };
      case 0.05:
        return {
          total: produtos.valor - produtos.valor * 0.05,
          id_produto_periodo: 2,
          desconto: pedido.total * 0.05,
          hash: produtos.uuid,
        };
      case 0.1:
        return {
          total: produtos.valor - produtos.valor * 0.1,
          id_produto_periodo: 3,
          desconto: pedido.total * 0.1,
          hash: produtos.uuid,
        };
      case 0.15:
        return {
          total: produtos.valor - produtos.valor * 0.15,
          id_produto_periodo: 4,
          desconto: pedido.total * 0.15,
          hash: produtos.uuid,
        };
      case 0.2:
        return {
          total: produtos.valor - produtos.valor * 0.2,
          id_produto_periodo: 5,
          desconto: pedido.total * 0.2,
          hash: produtos.uuid,
        };
    }
  }
}
