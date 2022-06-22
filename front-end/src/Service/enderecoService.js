

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;


export const getUnidadeFederativa = (data)=>{
    return axios.post(`${baseURL}listarUnidadeFederativa`,data);
   
} 


