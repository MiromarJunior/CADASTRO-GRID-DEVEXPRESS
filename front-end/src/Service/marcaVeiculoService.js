/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const getMarcaVeiculo = data=>{
    return axios.post(`${baseURL}listarMarcaVeiculo`,data);
} 






module.exports = {getMarcaVeiculo};