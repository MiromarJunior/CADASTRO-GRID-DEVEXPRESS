/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveFornecedor = data=>{
    return axios.post(`${baseURL}cadastrarFornecedor`,data);
} 
const saveContatoFornecedor = data=>{
    return axios.post(`${baseURL}cadastrarContatoFornecedor`,data);
} 
const getFornecedor = data=>{
    return axios.post(`${baseURL}listarFornecedor`,data);
} 
const deleteFornecedorID = data=>{
    return axios.post(`${baseURL}excluirFornecedor`,data);
}
const getContatoFornecedor = data=>{
    return axios.post(`${baseURL}listarContatoFornecedor`,data);
}
const deleteContatoForID = data=>{
    return axios.post(`${baseURL}excluirContatoFornecedor`,data);
}

module.exports = {deleteContatoForID,deleteFornecedorID,getContatoFornecedor,getFornecedor,saveFornecedor,saveContatoFornecedor};