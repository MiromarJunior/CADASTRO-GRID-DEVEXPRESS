




const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;


export const saveParametroLeilao = (data)=>{
    return axios.post(`${baseURL}cadastrarParametroLeilao`,data);
   
} 
