/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const getMarcaVeiculo = data=>{
    return axios.post(`${baseURL}listarMarcaVeiculo`,data);
}

const deleteMarcaVeiculo = data=>{
    return axios.post(`${baseURL}excluirMarcaVeiculo`,data);
} 

const saveMarcaVeiculo = data=>{
    return axios.post(`${baseURL}cadastrarMarcaVeiculo`,data);
} 









module.exports = {getMarcaVeiculo, deleteMarcaVeiculo, saveMarcaVeiculo};