/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const getGrupoItem = (data)=>{
    return axios.post(`${baseURL}listarGrupoItem`,data);
} 

const deleteGrupoItem = (data)=>{
    return axios.post(`${baseURL}excluirGrupoItem`,data);
} 

const saveGrupoItem = data=>{
    return axios.post(`${baseURL}cadastrarGrupoItem`,data);
} 


module.exports = {getGrupoItem, deleteGrupoItem, saveGrupoItem};