/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveSeguradora = data=>{
    return axios.post(`${baseURL}cadastrarSeguradora`,data);
} 
const saveContatoSeguradora = data=>{
    return axios.post(`${baseURL}cadastrarContatoSeguradora`,data);
} 

const getSeguradora = data=>{
    return axios.post(`${baseURL}listarSeguradora`,data);

} 

const deleteSeguradoraID = data=>{
    return axios.post(`${baseURL}excluirSeguradora`,data);
}

const getContatoSeguradora = data=>{
    return axios.post(`${baseURL}listarContatoSeguradora`,data);
}
const deleteContatoSegID = data=>{
    return axios.post(`${baseURL}excluirContatoSeguradora`,data);
}
const getAcessoSeguradora = data=>{
    return axios.post(`${baseURL}listarAcessoSeguradora`,data);
}
const saveAcessoSeguradora = data=>{
    return axios.post(`${baseURL}cadastrarAcessoSGRA`,data);
}






module.exports = {saveAcessoSeguradora,getAcessoSeguradora,deleteContatoSegID,deleteSeguradoraID,getContatoSeguradora,getSeguradora,saveSeguradora,saveContatoSeguradora};