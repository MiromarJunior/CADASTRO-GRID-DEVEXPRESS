/*
Métodos padrões para utilizar em todo front-end

*/

import { cnpj } from "cpf-cnpj-validator";
const emailV = /\S+@\S+\.\S+/;
const funcaoTeste = "teste";
const funcaoiury = "iury";
const funcaoiury3 = "teste iury 3";

const funcaoMiromar = "Miromar";

const funcaoMiromarnova  = "22236";
//  const dataBRa = (data)=>{
//     return(
//     new Date(data).getFullYear()+"-"+
//     ((new Date(data).getMonth()+(1))< 10 ?
//     "0"+(new Date(data).getMonth()+(1)) :
//     (new Date(data).getMonth()+(1))
//     )+"-"+
//     ((new Date(data).getDate())< 10 ?
//     "0"+(new Date(data).getDate()) :
//     (new Date(data).getDate())

//     )
//     )

// }
export const dataBR = (data) => {
  return (
    (new Date(data).getDate() < 10
      ? "0" + new Date(data).getDate()
      : new Date(data).getDate()) +
    "/" +
    (new Date(data).getMonth() + 1 < 10
      ? "0" + (new Date(data).getMonth() + 1)
      : new Date(data).getMonth() + 1) +
    "/" +
    new Date(data).getFullYear()
  );
};

export const valorBR = (data) => {
  return data.toLocaleString("pt-br", { style: "currency", currency: "BRL" });
};

export const valorLiquido = (valor, desconto) => {
  return valor - valor * (desconto / 100);
};

export const formataValorString = (valor) => {
  if (typeof valor === "string") {
    return valor.replace(",", ".");
  }
  return valor;
};

export const criando = (n) => {
  let v = n + 1;
  const res = {
    id: v,
    PRDT_DESCRICAO: "",
    PRDT_CODIGO: "",
    PRDT_VALOR: 0,
    PRDT_DT_VALIDADE: "dd/mm/yyyy",
  };
  v++;

  return res;
};

export const apenasNr = (nr) => {
  let nr1 = isNaN(nr) ? nr.replace(/\D/g, "") : nr;
  return nr1;
};

export const validaCNPJ = (cnpjSeguradora, emailSist) => {
  if (cnpj.isValid(apenasNr(cnpjSeguradora))) {
    return true;
  } else {
    window.alert("CNPJ inválido");
    return false;
  }
};

export const validaEMAIL = (emailSist) => {
  if (emailV.test(emailSist)) {
    return true;
  } else {
    window.alert("Email Sistema inválido");

    return false;
  }
};

export const validaRAZAO = (razaoSoc) => {
  if (document.getElementById("razaoSoc").value.length > 1) {
    return true;
  } else {
    window.alert("Favor Preencher campo Razão Social");

    return false;
  }
};

export const validaNomeFANT = () => {
  if (document.getElementById("nomeFant").value.length > 1) {
    return true;
  } else {
    window.alert("Favor Preencher campo Nome Fantasia");

    return false;
  }
};

export const validaCodLEG = () => {
  if (document.getElementById("codLeg").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher campo Código Legado");

    return false;
  }
};

export const validaTipoPESSOA = (valor) => {
  if (valor.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher campo Tipo Pessoa");
    return false;
  }
};

export const validaOpSIMPLES = (valor) => {
  if (valor.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher campo Optante Simples");

    return false;
  }
};

export const validaStatusSEG = (valor) => {
  if (valor.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher campo Status Seguradora");

    return false;
  }
};

export const validaCEP = () => {
  if (document.getElementById("cep").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o CEP");

    return false;
  }
};

export const validaUF = (valor) => {
  if (valor.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o UF");

    return false;
  }
};

export const validaCIDADE = () => {
  if (document.getElementById("cidade").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo Cidade");

    return false;
  }
};

export const validaBAIRRO = () => {
  if (document.getElementById("bairro").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo Bairro");

    return false;
  }
};

export const validaLOGRAD = () => {
  if (document.getElementById("lograd").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo Logradouro");

    return false;
  }
};

export const validaNRLOGRAD = () => {
  if (document.getElementById("nrLograd").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo NR");

    return false;
  }
};

export const validaCOMPL = () => {
  if (document.getElementById("compl").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo Complemento");

    return false;
  }
};
export const validaSMTP = () => {
  if (document.getElementById("smtp").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo SMTP");

    return false;
  }
};

export const validaPORTA = () => {
  if (document.getElementById("porta").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo PORTA");

    return false;
  }
};
export const validaSEMAIL = () => {
  if (document.getElementById("semail").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo Senha Usuário Email");

    return false;
  }
};

export const validaREMET = () => {
  if (document.getElementById("remet").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo Remetente");

    return false;
  }
};

export const validaNREMET = () => {
  if (document.getElementById("nremet").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo Nome Remetente");

    return false;
  }
};

export const validaSOAPRET = () => {
  if (document.getElementById("soapret").value.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo SOAP Retorno");

    return false;
  }
};

export const validaSOAPNOT = () => {
  if (document.getElementById("soapNo").value.length > 0) {
    document.getElementById("soapNo").style.borderColor = "#ddd";
    return true;
  } else {
    window.alert("Favor Preencher o campo SOAP Notas");

    return false;
  }
};
export const validaSMTPAuth = (valor) => {
  if (valor.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo SMTP Auth");
    return false;
  }
};
export const validaSMTPSecure = (valor) => {
  if (valor.length > 0) {
    return true;
  } else {
    window.alert("Favor Preencher o campo SMTP Secure");
    return false;
  }
};

export const validaGRID = (valor, val, changedRows, setRows, msg) => {
  // if(valor === "" || !valor ){
  //     val = false;
  //     msg = "Campo URL não pode ser nulo";
  //     setRows(changedRows);
  //     return true;
  //  } else {
  //     return false;
  //  }
};

export const criandoU = (n) => {
  let v = n + 1;
  const res = {
    id: v,
    SGCO_NOME: "",
    SGCO_FUNCAO: "",
    SGCO_DEPARTAMENTO: "",
    SGCO_EMAIL: "",
    SGCO_URL: "",
    SGCO_CELULAR_DDD: "",
    SGCO_CELULAR_NUMERO: "",
    SGCO_CELULAR_OPERADORA: "",
    SGCO_FONE_COMERCIAL_DDD: "",
    SGCO_FONE_COMERCIAL_NUMERO: "",
    SGCO_FONE_COMERCIAL_RAMAL: "",
  };
  v++;

  return res;
};
