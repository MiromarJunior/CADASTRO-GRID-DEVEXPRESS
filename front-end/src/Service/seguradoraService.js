/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveSeguradora = data=>{
    return axios.post(`${baseURL}cadastrarSeguradora`,data);
} 
// const saveContatoSeguradora = data=>{
//     return axios.post(`${baseURL}cadastrarContatoSeguradora`,data);
// } 






module.exports = {saveSeguradora};