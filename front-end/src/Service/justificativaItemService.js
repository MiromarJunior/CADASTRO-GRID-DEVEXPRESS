/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários
*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveJustificativaItem = data=>{
    return axios.post(`${baseURL}cadastrarSac`,data);
} 

const getJustificativaItem = data=>{
    return axios.post(`${baseURL}listarJustificativaItem`,data);

} 

const deleteJustificativaItemID = data=>{
    return axios.post(`${baseURL}excluirJustificativaItem`,data);
}

module.exports = {saveJustificativaItem, getJustificativaItem, deleteJustificativaItemID};