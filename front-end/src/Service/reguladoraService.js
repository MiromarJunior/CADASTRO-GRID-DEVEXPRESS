/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveReguladora = data=>{
    return axios.post(`${baseURL}cadastrarReguladora`,data);
} 
const saveContatoReguladora = data=>{
    return axios.post(`${baseURL}cadastrarContatoReguladora`,data);
} 
const getReguladora = data=>{
    return axios.post(`${baseURL}listarReguladora`,data);
} 
const deleteReguladoraID = data=>{
    return axios.post(`${baseURL}excluirReguladora`,data);
}
const getContatoReguladora = data=>{
    return axios.post(`${baseURL}listarContatoReguladora`,data);
}
const deleteContatoReguladoraID = data=>{    
    return axios.post(`${baseURL}excluirContatoReguladora`,data);
}

module.exports = {deleteContatoReguladoraID,deleteReguladoraID,getContatoReguladora,getReguladora,saveReguladora,saveContatoReguladora};