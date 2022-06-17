/*
Métodos padrões para utilizar em todo front-end

*/



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