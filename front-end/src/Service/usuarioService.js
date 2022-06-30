/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveUsuario = data=>{
    return axios.post(`${baseURL}cadastrarUsuario`,data);
} 
const loginUsuario = (data)=>{
    return axios.post(`${baseURL}loginUsuario`,data);
} 
const getUsuarios = (data)=>{
    return axios.post(`${baseURL}listarUsu`,data);
} 
const deleteUsuario = (data)=>{
    return axios.post(`${baseURL}excluirUsuario`,data);
} 
const getGrupoAcesso = (data)=>{
    return axios.post(`${baseURL}listarGrupoAcesso`,data);
} 



const api = axios.create({baseURL});

module.exports = {getGrupoAcesso,api,saveUsuario,loginUsuario,getUsuarios,deleteUsuario};