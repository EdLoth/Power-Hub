import { ImovelModel } from "src/graphql/models/imovel";
import { ImovelServices } from "../graphql/services";
import { authAPiGis, getService } from "../services/ApiGis";
import { ConfigurationServicePlaceholders } from "aws-sdk/lib/config_service_placeholders";
import { sleep } from "./utils";

type PedidoItem = {
  id_produto: number;
  total: number;
  qtde_itens: number;
  desconto: number;
};

export class SyncServices {
  // async getImoveis() {
  //     const imoveisSync = ImovelServices.findSync();
  //     return imoveisSync
  // }

  public async syncImoveis() {
    const listImoveis = await ImovelServices.findSync();
    let mapSync = this;
    for (const item of listImoveis) {
      mapSync.syncImovel(item.id);
      await sleep(300);
    }
  }

  public async syncImovel(id) {
    const imovel = await ImovelServices.findImoveFicha(parseInt(id));

    const tokenGis = await authAPiGis("admin", "*|Urbit|*2019");
    if (tokenGis["autorization"] == "success") {
      // console.log("Foi ");
      const token = tokenGis["token"];
      //   console.log(token);

      const municipios = await getService(
        `http://api.urbit.com.br/municipios/${imovel.longitude}/${imovel.latitude}`,
        token
      );
      let estado = municipios["uf"];
      let id_municipio = municipios["id"];
      let id_estado = municipios["estado_id"];
      const municipio_url = "sao-paulo";

      let macroarea = null;
      let fpr = null;
      let fpnr = null;

      try {
        const macroareaResult = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/macroarea/${imovel.longitude}/${imovel.latitude}`,
          token
        );

        if (macroareaResult) {
          if (macroareaResult["itens"].length > 0) {
            macroarea = macroareaResult["itens"][0]["tx_macro_d"];
            fpr = macroareaResult["itens"][0]["fpr"];
            fpnr = macroareaResult["itens"][0]["fpnr"];
          }
        }
      } catch (error) {
        console.log("erro");
      }
      let macrozona = null;
      try {
        const macrozonaResult = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/macrozona/${imovel.longitude}/${imovel.latitude}`,
          token
        );

        if (macrozonaResult) {
          if (macrozonaResult["itens"].length > 0) {
            macrozona = macrozonaResult["itens"][0]["macrozona"];
          }
        }
      } catch (error) {
        console.log("erro");
      }
      let zoneamento = null;
      try {
        const zoneamentoResult = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/zoneamento/${imovel.longitude}/${imovel.latitude}`,
          token
        );

        if (zoneamentoResult && typeof zoneamentoResult !== "undefined") {
          if (zoneamentoResult["itens"].length > 0) {
            zoneamento = zoneamentoResult["itens"][0]["zona"];
          }
        }
      } catch (error) { 
        console.error(error);
        console.error("Erro ao buscar o Zoneamento");
      }

      let setorquadra = null;
      try {
        const setorquadraResult = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/setor-quadra/${imovel.longitude}/${imovel.latitude}`,
          token
        );

        if (setorquadraResult) {
          if (setorquadraResult["itens"].length > 0) {
            setorquadra = setorquadraResult["itens"][0]["setor_quadra"];
          }
        }
      } catch (error) {
        console.log("erro");
      }

      let operacaoUrbana = null;
      let operacaoToMaxima = null;
      let operacaoCaMaxima = null;

      try {
        const parametros_operacoes_urbanasResult = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/parametros_operacoes_urbanas/${imovel.longitude}/${imovel.latitude}`,
          token
        );
        if (parametros_operacoes_urbanasResult) {
          if (parametros_operacoes_urbanasResult["itens"].length > 0) {
            if (
              parametros_operacoes_urbanasResult["itens"][0][
                "codigo_operacao"
              ] !== ""
            ) {
              // console.log("vazio");
            }
            operacaoUrbana =
              "Cód.:" +
              parametros_operacoes_urbanasResult["itens"][0]["zona"] +
              " / Setor: " +
              parametros_operacoes_urbanasResult["itens"][0]["lei"];
            // operacaoToMaxima = parametros_operacoes_urbanasResult['itens'][0]['to_max']
            // operacaoCaMaxima = parametros_operacoes_urbanasResult['itens'][0]['ca_max']
          }
        }
      } catch (error) {
        console.error(error);
        console.error("Erro ao buscar o Zoneamento");
      }
      let to_500 = null;
      let to_500mais = null;
      let recuo_frente = null;
      let recuo_lat_fundos = null;
      let recuo_lat_fundos10 = null;
      let gabarito = null;
      let tx_ocupacao_max = null;
      try {
        const parametros_uso_ocupacaoResult = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/parametros-uso-ocupacao/${imovel.longitude}/${imovel.latitude}`,
          token
        );

        // console.log(parametros_uso_ocupacaoResult)

        if (parametros_uso_ocupacaoResult["itens"].length > 0) {
          to_500 = parametros_uso_ocupacaoResult["itens"][0]["to_500"];
          to_500mais = parametros_uso_ocupacaoResult["itens"][0]["to_500mais"];
          recuo_frente =
            parametros_uso_ocupacaoResult["itens"][0]["recuo_frente"];
          recuo_lat_fundos =
            parametros_uso_ocupacaoResult["itens"][0]["recuo_lat_fundos"];
          recuo_lat_fundos10 =
            parametros_uso_ocupacaoResult["itens"][0]["recuo_lat_fundos10"];
          gabarito = parametros_uso_ocupacaoResult["itens"][0]["gabarito"];
          tx_ocupacao_max =
            parametros_uso_ocupacaoResult["itens"][0]["tx_ocupacao_max"];
        }
      } catch (error) {
        console.log("erro");
      }
      let quadro14 = null;
      try {
        const quadro14Result = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/quadro14/${imovel.longitude}/${imovel.latitude}`,
          token
        );

        if (quadro14Result) {
          if (quadro14Result["itens"].length > 0) {
            quadro14 = quadro14Result["itens"][0]["preco"];
          }
        }
      } catch (error) {
        console.log("erro");
      }
      let cep = null;
      let area_do_terreno = null;
      let numero_contribuinte = null;
      let cd_lote = null;
      let dc_tipo_us = null;
      let testada_para_calculo = null;
      let marcacao = null;
      let nome_contribuinte = null;

      try {
        const loteResult = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/lote-fiscal/${imovel.longitude}/${imovel.latitude}`,
          token
        );
   
        if (loteResult) {
     
          if (loteResult) {

            
            cep = loteResult["itens"][0]["cep"];
            area_do_terreno = loteResult["itens"][0]["area_lote"];
            numero_contribuinte = loteResult["itens"][0]["numero_contribuinte"];
            nome_contribuinte = loteResult["itens"][0]["nome_contribuinte"];
            cd_lote = loteResult["itens"][0]["lote"];
            dc_tipo_us = loteResult["itens"][0]["uso_atual"];
            testada_para_calculo =
              loteResult["itens"][0]["testada"];

            //  console.log('imovel.marcacao')
            //  console.log(imovel.marcacao)

            //  console.log(loteResult['itens'][0]['geom'])
            if (!imovel.marcacao) {
              marcacao = loteResult["itens"][0]["geom"];
            }
          }
        }
      } catch (error) {
        console.log("erro loteResult");
        console.log(error);
      }
      // console.log(marcacao)
      let cabas = null;
      let camax = null;
      try {
        const lpuos_quadro3Result = await getService(
          `http://api.urbit.com.br/municipio/${municipio_url}/lpuos-quadro3/${imovel.longitude}/${imovel.latitude}`,
          token
        );

        if (lpuos_quadro3Result) {
          if (lpuos_quadro3Result["itens"].length > 0) {
            cabas = lpuos_quadro3Result["itens"][0]["cabas"];
            camax = lpuos_quadro3Result["itens"][0]["camax"];
          }
        }
      } catch (error) {
        console.log("erro");
      }
      let data = {
        // bairro:bairro,
        // cidade,
        estado: estado ? estado : null,
        id_municipio:  id_municipio ? id_municipio : null,
        postgis_municipio_id: id_municipio,
        id_cidade: id_municipio ? id_municipio : null,
        id_estado: id_estado ? id_estado : null,
        cep:cep ? cep : null,
        zoneamento,
        numero_contribuinte:numero_contribuinte,
        nome_contribuinte:nome_contribuinte,
        setor_quadra: setorquadra,
        macroarea,
        macrozona,
        fpr: fpr ? Number(fpr) : null,
        fpnr: fpnr ? Number(fpnr) : null,
        cabas: cabas ? Number(cabas) : null,
        camax: camax ? Number(camax) : null,
        quadro14,
        metragem: area_do_terreno ? Number(area_do_terreno) : null,
        testada: testada_para_calculo ? Number(testada_para_calculo) : null,
        operacao_urbana: operacaoUrbana,
        operacao_to_maxima: operacaoToMaxima,
        // operacao_ca_maximo: operacaoCaMaxima,
        parametros_uso_to_500: to_500 ? Number(to_500) : null,
        parametros_uso_to_500mais: to_500mais ? Number(to_500mais) : null,
        parametros_uso_recuo_frente: recuo_frente,
        parametros_uso_recuo_lat_fundos: recuo_lat_fundos,
        parametros_uso_recuo_lat_fundos10: recuo_lat_fundos10,
        parametros_uso_recuo_gabarito: gabarito,
        parametros_uso_to_maxima: tx_ocupacao_max
          ? Number(tx_ocupacao_max)
          : null,
        marcacao: marcacao ? marcacao : null,
        sincronizado: "ok",
      };
      
      // console.log('data')
      // console.log(data)
      const imovelUpdate = await ImovelServices.updateSync(parseInt(id), data);
      //   console.log("tokenGis");
      //   console.log(tokenGis);
      //   console.log(imovel);
      //   console.log(service);

      return imovelUpdate;
    }
  }
}

// SyncServices()
