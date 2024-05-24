import { UsuarioProdutosServices } from "../graphql/services"
import funcionarios from "../graphql/services/funcionarios"

export const generateFirstDigits = (): string => {
    let digits = ''
    for (let i = 0; i < 9; ++i) {
      digits += String(Math.floor(Math.random() * 10))
    }
  
    return digits
  }
  
  export const hasCPFLength = (cpf: string): void | boolean => {
    if (cpf.length > 11 || cpf.length < 11) {
      return false
    }
  
    return true
  }
  
  // format option
  // true   return 000.000.000-00
  // false  return 00000000000
  export const formatCPF = (cpf: string, format?: boolean): string => {
    let digitsSeparator = ''
    let checkersSeparator = ''
  
    if (format) {
      digitsSeparator = '.'
      checkersSeparator = '-'
    }
  
    return (
      cpf.slice(0, 3) +
      digitsSeparator +
      cpf.slice(3, 6) +
      digitsSeparator +
      cpf.slice(6, 9) +
      checkersSeparator +
      cpf.slice(9, 11)
    )
  }
  
  export const allDigitsAreEqual = (digits: string): boolean => {
    for (let i = 0; i < 10; i++) {
      if (digits === Array.from({ length: digits.length + 1 }).join(String(i))) {
        return true
      }
    }
  
    return false
  }

  export const calcFirstChecker = (firstNineDigits: string): number => {
    let sum = 0
  
    for (let i = 0; i < 9; ++i) {
      sum += Number(firstNineDigits.charAt(i)) * (10 - i)
    }
  
    const lastSumChecker = sum % 11
    return lastSumChecker < 2 ? 0 : 11 - lastSumChecker
  }
  
  export const calcSecondChecker = (cpfWithChecker1: string): number => {
    let sum = 0
  
    for (let i = 0; i < 10; ++i) {
      sum += Number(cpfWithChecker1.charAt(i)) * (11 - i)
    }
  
    const lastSumChecker2 = sum % 11
    return lastSumChecker2 < 2 ? 0 : 11 - lastSumChecker2
  }


  export const verificaUsuarioProduto =async (idUser:number) => {
    let empresa = await funcionarios.findFuncionarioEmpresaByIdUser(
      idUser
    );
    let produtos = await UsuarioProdutosServices.usuarioProdutosList(
      idUser
    );
  }

  export function permissaoAcessoProduto(produtosUsuario,produto ){
    const produtos = produtosUsuario.filter((item)=>{
      return item.id == produto
    })
    if(produtos.length > 0 ){
      return true
    }else{
      return false
    }
  }

  export const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay))