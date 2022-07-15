




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


