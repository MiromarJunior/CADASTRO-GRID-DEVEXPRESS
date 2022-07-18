




const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;


export const saveParametroLeilao = (data)=>{
    return axios.post(`${baseURL}cadastrarParametroLeilao`,data);
   
} 

export const getParametroLeilao = (data)=>{
    return axios.post(`${baseURL}listarParametroLeilaoSeg`,data);
   
} 
export const deleteParametroLeilao = (data)=>{
    return axios.post(`${baseURL}excluirParametroLeilao`,data);
   
} 
export const getSegParametroLeilao = (data)=>{
  return axios.post(`${baseURL}listarSeguradorParamLeilao`,data);
 
} 






export const formataPercLeilao = (valor)=>{
    // Substitui po (.) por (,)    
      let v = Number(valor).toFixed(2);  
      return        v.toString().replace(".",",")    
  }

export const maxValperc = (valor,msg)=>{
   if(valor > 0 && valor < 10){
    return true
   }else{
    return (false,
        window.alert(msg))
   }   
  }

  export const limit2 =(valor)=>{
    if(valor){
      return  parseFloat(valor).toFixed(2);
    }else {
      return "0 "
    }


  }


