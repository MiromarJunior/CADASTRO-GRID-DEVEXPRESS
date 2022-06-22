/*
Métodos padrões para utilizar em todo front-end

*/

import { cnpj, cpf } from "cpf-cnpj-validator"
const emailV = /\S+@\S+\.\S+/;


 const dataBRa = (data)=>{
    return(
    new Date(data).getFullYear()+"-"+
    ((new Date(data).getMonth()+(1))< 10 ?
    "0"+(new Date(data).getMonth()+(1)) :
    (new Date(data).getMonth()+(1)) 
    )+"-"+
    ((new Date(data).getDate())< 10 ?
    "0"+(new Date(data).getDate()) :
    (new Date(data).getDate()) 

    )
    )
  

}
export const dataBR =(data)=>{
    return(        
        ((new Date(data).getDate()) < 10 ? "0"+new Date(data).getDate() : new Date(data).getDate())+"/"
        +((new Date(data).getMonth()+(1)) < 10 ? "0"+(new Date(data).getMonth()+(1)) : (new Date(data).getMonth()+(1))) +"/"
        +new Date(data).getFullYear()
    )
}

export const valorBR =(data)=>{
    return data.toLocaleString('pt-br', { style: 'currency', currency: 'BRL' })
}

export const valorLiquido = (valor, desconto)=>{
    return (valor - (valor * (desconto/100)));
}

export const  formataValorString = (valor)=>{
    if(typeof(valor) === "string"){
    return  valor.replace(",",".");
    }
    return valor;
  }

export const criando=(n)=>{
    let v = n+1
    const res = {
        id: v,
        PRDT_DESCRICAO: '',
        PRDT_CODIGO: "",
        PRDT_VALOR: 0,
        PRDT_DT_VALIDADE: 'dd/mm/yyyy'

    }
    v++;
   
  return res;

}


export const apenasNr = (nr)=>{
    
    let nr1 = (isNaN(nr)) ? nr.replace(/\D/g, '') : nr;
    return nr1;
}


export const validaCNPJ = (cnpjSeguradora,emailSist )=>{
    if(cnpj.isValid(apenasNr(cnpjSeguradora))){
        return true
    }else {window.alert("CNPJ inválido");       
    document.getElementById('txtCnpj').style.borderColor = "red";  
    return false   
    }  
}

export const validaEMAIL = (emailSist )=>{
    if(emailV.test(emailSist)){
        return true
    }else{
        window.alert("Email Sistema inválido");       
    document.getElementById("txtEmailU").style.borderColor = "red";     
    return false
    }
}

export const validaRAZAO = (razaoSoc )=>{
    if(document.getElementById("razaoSoc").value.length > 1){
        return true;
    }else{
        window.alert("Favor Preencher campo Razão Social");       
    document.getElementById("razaoSoc").style.borderColor = "red";     
    return false
    }

}

export const validaNomeFANT = ()=>{
    if(document.getElementById("nomeFant").value.length > 1){
        return true;
    }else{
        window.alert("Favor Preencher campo Nome Fantasia");       
    document.getElementById("nomeFant").style.borderColor = "red";     
    return false
    }

}

export const validaCodLEG = ()=>{
    if(document.getElementById("codLeg").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher campo Código Legado");       
    document.getElementById("codLeg").style.borderColor = "red";     
    return false
    }

}


export const validaTipoPESSOA = ()=>{
    if(document.getElementById("tipoP").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher campo Tipo Pessoa");       
    document.getElementById("tipoP").style.borderColor = "red";     
    return false
    }

}

export const validaOpSIMPLES = ()=>{
    if(document.getElementById("opSimp").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher campo Optante Simples");       
    document.getElementById("opSimp").style.borderColor = "red";     
    return false
    }

}

export const validaStatusSEG = ()=>{
    if(document.getElementById("statusSEG").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher campo Status Seguradora");       
    document.getElementById("statusSEG").style.borderColor = "red";     
    return false
    }

}

export const validaCEP = ()=>{
    if(document.getElementById("cep").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o CEP");       
    document.getElementById("cep").style.borderColor = "red";     
    return false
    }

}

export const validaUF = ()=>{
    if(document.getElementById("uf").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o UF");       
    document.getElementById("uf").style.borderColor = "red";     
    return false
    }

}

export const validaCIDADE = ()=>{
    if(document.getElementById("cidade").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo Cidade");       
    document.getElementById("cidade").style.borderColor = "red";     
    return false
    }

}



export const validaBAIRRO = ()=>{
    if(document.getElementById("bairro").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo Bairro");       
    document.getElementById("bairro").style.borderColor = "red";     
    return false
    }

}

export const validaLOGRAD = ()=>{
    if(document.getElementById("lograd").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo Logradouro");       
    document.getElementById("lograd").style.borderColor = "red";     
    return false
    }

}

export const validaNRLOGRAD = ()=>{
    if(document.getElementById("nrLograd").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo NR");       
    document.getElementById("nrLograd").style.borderColor = "red";     
    return false
    }

}

export const validaCOMPL = ()=>{
    if(document.getElementById("compl").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo Complemento");       
    document.getElementById("compl").style.borderColor = "red";     
    return false
    }

}
export const validaSMTP = ()=>{
    if(document.getElementById("smtp").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo SMTP");       
    document.getElementById("smtp").style.borderColor = "red";     
    return false
    }

}

export const validaPORTA = ()=>{
    if(document.getElementById("porta").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo PORTA");       
    document.getElementById("porta").style.borderColor = "red";     
    return false
    }

}
export const validaSEMAIL = ()=>{
    if(document.getElementById("semail").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo Senha Usuário Email");       
    document.getElementById("semail").style.borderColor = "red";     
    return false
    }

}

export const validaREMET = ()=>{
    if(document.getElementById("remet").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo Remetente");       
    document.getElementById("remet").style.borderColor = "red";     
    return false
    }

}


export const validaNREMET = ()=>{
    if(document.getElementById("nremet").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo Nome Remetente");       
    document.getElementById("nremet").style.borderColor = "red";     
    return false
    }

}

export const validaSOAPRET = ()=>{
    if(document.getElementById("soapret").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo SOAP Retorno");       
    document.getElementById("soapret").style.borderColor = "red";     
    return false
    }

}


export const validaSOAPNOT = ()=>{
    if(document.getElementById("soapNo").value.length > 0){
        return true;
    }else{
        window.alert("Favor Preencher o campo SOAP Notas");       
    document.getElementById("soapNo").style.borderColor = "red";     
    return false
    }

}










