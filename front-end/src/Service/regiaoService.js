/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários
*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveRegiao = data=>{
    return axios.post(`${baseURL}cadastrarRegiao`,data);
} 

const getRegiao = data=>{
    return axios.post(`${baseURL}listarRegiao`,data);

} 

const deleteRegiaoID = data=>{
    return axios.post(`${baseURL}excluirRegiao`,data);
}

module.exports = {saveRegiao, getRegiao, deleteRegiaoID};