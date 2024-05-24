import { authAPiGis, postService } from "../services/ApiBDC";
import { ProprietarioServices } from "../graphql/services";
import {
  allDigitsAreEqual,
  calcFirstChecker,
  calcSecondChecker,
  hasCPFLength,
} from "./utils";
import situacao from "src/graphql/services/empreendimentos/situacao";

export class SyncServices {
  validateCpf(value: string): boolean {
    if (typeof value !== "string") {
      return false;
    }

    const cleanCPF = String(value).replace(/[\s.-]/g, "");
    const firstNineDigits = cleanCPF.slice(0, 9);
    const checker = cleanCPF.slice(9, 11);

    if (!hasCPFLength(cleanCPF) || allDigitsAreEqual(cleanCPF)) {
      return false;
    }

    const checker1 = calcFirstChecker(firstNineDigits);
    const checker2 = calcSecondChecker(`${firstNineDigits}${checker1}`);

    return checker === `${checker1}${checker2}`;
  }

  validaCNPJ(cnpj: string): boolean {
    cnpj = cnpj.replace(/[^\d]+/g, "");

    if (cnpj == "") return false;

    if (cnpj.length != 14) return false;
    if (
      cnpj == "00000000000000" ||
      cnpj == "11111111111111" ||
      cnpj == "22222222222222" ||
      cnpj == "33333333333333" ||
      cnpj == "44444444444444" ||
      cnpj == "55555555555555" ||
      cnpj == "66666666666666" ||
      cnpj == "77777777777777" ||
      cnpj == "88888888888888" ||
      cnpj == "99999999999999"
    )
      return false;

    // Valida DVs
    let tamanho: number = cnpj.length - 2;
    let numeros: any = cnpj.substring(0, tamanho);
    let digitos: any = cnpj.substring(tamanho);
    let soma = 0;
    let pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(0)) return false;

    tamanho = tamanho + 1;
    numeros = cnpj.substring(0, tamanho);
    soma = 0;
    pos = tamanho - 7;
    for (let i = tamanho; i >= 1; i--) {
      soma += numeros.charAt(tamanho - i) * pos--;
      if (pos < 2) pos = 9;
    }
    resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
    if (resultado != digitos.charAt(1)) return false;

    return true;
  }

  public async syncProprietario(id:number, id_user:number) {
    const proprietario = await ProprietarioServices.getProprietario(id);
    
    if (proprietario) {
      if (proprietario.cpf) {
        if (this.validateCpf(proprietario.cpf)) {
          const cpf = proprietario.cpf
            .replace(".", "")
            .replace(".", "")
            .replace(".", "")
            .replace("-", "");

          let resultSave =  await this.savePF(id, cpf, id_user);
          if (resultSave){
            return { error: false, result: resultSave };
          }else{
            return { error: true,  mensagem: "Erro ao sincronizar os dados. CPF pode não existir na base de dados." };
          }
        } else {
          return { error: true, mensagem: "CPF Inválido" };
        }
      } else if (proprietario.cnpj) {
        if (this.validaCNPJ(proprietario.cnpj)) {
          const cnpj = proprietario.cnpj
            .replace(".", "")
            .replace(".", "")
            .replace("/", "")
            .replace("-", "");

          let resultSave = this.saveCNPJ(id, cnpj, id_user);
          if (resultSave){
            return { error: false, result: resultSave };
          }else{
            return { error: true,  mensagem: "Erro ao sincronizar os dados. CPNJ pode não existir na base de dados." };
          }
        } else {
          return { error: true, mensagem: "CPF Inválido" };
        }
      }
    } else {
      return { error: true, mensagem: "Proprietário não existe" };
    }
  }

  public formataCPF(cpf:string) {
    cpf = cpf.replace(/[^\d]/g, "");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }

  public formataCNPJ(value:string) {
    const cnpjCpf = value.replace(/\D/g, "");
    if (cnpjCpf.length === 11) {
      return cnpjCpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
    }

    return cnpjCpf.replace(
      /(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/g,
      "$1.$2.$3/$4-$5"
    );
  }

  public async syncPessoas(doc:string, id_user) {
    if (doc.length == 11) {
      if (!this.validateCpf(doc)) {
        return { error: true, mensagem: "CPF Inválido" };
      } else {
        doc = this.formataCPF(doc);
        const proprietario = await ProprietarioServices.getProprietarioByCpf(doc);
        let resultSave = null;
        if (proprietario) {
          resultSave = await this.saveDoc(proprietario.id, doc, "cpf", id_user);
        } else {
          resultSave = await this.saveDoc(null, doc, "cpf", id_user);
        }

        return { error: false, result: resultSave };
      }
    } else {
      if (!this.validaCNPJ(doc)) {
        return { error: true, mensagem: "CPF Inválido" };
      } else {
        doc = this.formataCNPJ(doc);
        const proprietario = await ProprietarioServices.getProprietarioByCnpj(doc);

        let resultSave = null;
        if (proprietario) {
          resultSave = await this.saveDoc(proprietario.id, doc, "cnpj", id_user);
        } else {
          resultSave = await this.saveDoc(null, doc, "cnpj", id_user);
        }

        return { error: false, result: resultSave };
      }
    }
  }

  public async saveDoc(id: number, doc:string, type:string, id_user:number) {
    let serivosProprietario = null;
    let cpf = type == "cpf" ? doc : undefined;
    let cnpj = type == "cnpj" ? doc : undefined;

    if (type == "cpf") {
      serivosProprietario = await this.getByCPF(doc);
    } else if (type == "cnpj") {
      serivosProprietario = await this.getByCNPJ(doc);
    }

    // console.log('serivosProprietario')
    // console.log(serivosProprietario)

    if (serivosProprietario){
   
      let dataSave = {
        nome: cpf
          ? serivosProprietario["basic_data"][0]["BasicData"]["Name"]
          : serivosProprietario["basic_data"][0]["BasicData"]["OfficialName"],
        cpf: cpf,
        cnpj: cnpj,
        // endereco: serivosProprietario["addresses_extended"].length > 0 ?  serivosProprietario["addresses_extended"][0]["ExtendedAddresses"]["Addresses"][0]["Typology"] +" " +serivosProprietario["addresses_extended"][0]["ExtendedAddresses"]["Addresses"][0]["AddressMain"] : null,
        // numero:serivosProprietario["addresses_extended"].length > 0 ? serivosProprietario["addresses_extended"][0]["ExtendedAddresses"]["Addresses"][0]["Number"],
        // complemento: serivosProprietario["addresses_extended"][0]["ExtendedAddresses"][ "Addresses"][0]["Complement"],
        // cep: serivosProprietario["addresses_extended"][0]["ExtendedAddresses"]["Addresses"][0]["ZipCode"],
        basic_data: serivosProprietario["basic_data"],
        emails_extended: serivosProprietario["emails_extended"],
        addresses_extended: serivosProprietario["addresses_extended"],
        phones_extended: serivosProprietario["phones_extended"],
        related_people: serivosProprietario["related_people"],
        related_people_emails: serivosProprietario["related_people_emails"],
        related_people_phones: serivosProprietario["related_people_phones"],
        data_cadastro: new Date(),
        situacao:1,
        id_usuario_cadastro:id_user
      };
      if (id) {
        return await ProprietarioServices.updateSync(id, dataSave);
      } else {
        return await ProprietarioServices.createSync(dataSave);
      }
    }else{
      return false;
    }
  }

  public async getByCPF(cpf: string) {
    const services = [
      "basic_data",
      "emails_extended",
      "addresses_extended",
      "phones_extended",
      "related_people",
      "related_people_emails",
      "related_people_phones",
    ];
    let serivosProprietario = {};
    try {
      for (var i in services) {
        let result = await postService(
          "https://bigboost.bigdatacorp.com.br/peoplev2",
          {
            Datasets: services[i],
            q: `doc{${cpf}}`,
            AccessToken: "7c6bca86-de1e-4f53-a69a-a3cd00daeb7a",
          },
          {
            "Content-Type": "application/json",
          }
        );
        serivosProprietario[services[i]] = result["Result"];
      }

      return serivosProprietario;
    } catch (e) {
      console.log('erro 257')
      console.log(e)
      return false
    }
  }

  public async getByCNPJ(cnpj: string) {
    const services = [
      "basic_data",
      "emails_extended",
      "addresses_extended",
      "phones_extended",
      "related_people",
      "related_people_emails",
      "related_people_phones",
    ];
    let serivosProprietario = {};
    try {
      for (var i in services) {
        let result = await postService(
          "https://bigboost.bigdatacorp.com.br/companies",
          {
            Datasets: services[i],
            q: `doc{${cnpj}}`,
            AccessToken: "7c6bca86-de1e-4f53-a69a-a3cd00daeb7a",
          },
          {
            "Content-Type": "application/json",
          }
        );
        serivosProprietario[services[i]] = result["Result"];
      }

      return serivosProprietario;
    } catch (e) {
      console.log('Erro 292')
      console.log(e)
      return false
    }
  }

  public async savePF(id: number, cpf: string, id_user:number) {
    let serivosProprietario = this.getByCPF(cpf);
    if (serivosProprietario){
      let dataSave = {
        basic_data: serivosProprietario["basic_data"],
        emails_extended: serivosProprietario["emails_extended"],
        addresses_extended: serivosProprietario["addresses_extended"],
        phones_extended: serivosProprietario["phones_extended"],
        related_people: serivosProprietario["related_people"],
        related_people_emails: serivosProprietario["related_people_emails"],
        related_people_phones: serivosProprietario["related_people_phones"],
        data_cadastro: new Date(),
        situacao:1,
        id_usuario_cadastro:id_user
      };
      return await ProprietarioServices.updateSync(id, dataSave);
    }else{
      return false
    }
  }

  public async saveCNPJ(id: number, cnpj: string, id_user:number) {
    let serivosProprietario = this.getByCNPJ(cnpj);
    if (serivosProprietario) {
      let dataSave = {
        basic_data: serivosProprietario["basic_data"],
        emails_extended: serivosProprietario["emails_extended"],
        addresses_extended: serivosProprietario["addresses_extended"],
        phones_extended: serivosProprietario["phones_extended"],
        related_people: serivosProprietario["related_people"],
        related_people_emails: serivosProprietario["related_people_emails"],
        related_people_phones: serivosProprietario["related_people_phones"],
        data_cadastro: new Date(),
        situacao:1,
        id_usuario_cadastro:id_user
      };
      return await ProprietarioServices.updateSync(id, dataSave);
    }else{
      return false
    }
  }
}
