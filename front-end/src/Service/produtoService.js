/*
Página utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos produtos


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;


const getProdutos = (data)=>{
    return axios.post(`${baseURL}listarProduto`,data);
   
} 


const getProdutosID = data=>{
    return axios.post(`${baseURL}listarProdutoID`,data);
} 

const deleteProduto = data =>{
    return axios.post(`${baseURL}excluirProduto`, data)
}



const saveProdutos = data =>{
    return axios.post(`${baseURL}cadastrarProduto`,data);
} 

const dataFormatadaInput = (data)=>{
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
const dataFormatadaListar =(data)=>{
    return(
        
        ((new Date(data).getDate()) < 10 ? "0"+new Date(data).getDate() : new Date(data).getDate())+"/"
        +((new Date(data).getMonth()+(1)) < 10 ? "0"+(new Date(data).getMonth()+(1)) : (new Date(data).getMonth()+(1))) +"/"
        +new Date(data).getFullYear()
    )
}

 const updateListaProd = data =>{
    return axios.post(`${baseURL}editarListaProdutos`,data);
} 




module.exports = {updateListaProd,deleteProduto,getProdutosID,dataFormatadaInput,dataFormatadaListar, getProdutos,saveProdutos}