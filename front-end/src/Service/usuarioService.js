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
const saveGrupoAcesso = (data)=>{
    return axios.post(`${baseURL}cadastrarGrupoAcesso`,data);
} 
const deleteGrupoAcesso = (data)=>{
    return axios.post(`${baseURL}excluirGrupoAcesso`,data);
} 

const getAcesso = (data)=>{
    return axios.post(`${baseURL}listarAcesso`,data);
} 

const getAcessoUsu = (data)=>{
    return axios.post(`${baseURL}listarAcessoUsu`,data);
} 
const saveAcesso = (data)=>{
    return axios.post(`${baseURL}cadastrarAcesso`,data);
} 

const getAcessoUserMenu = (data)=>{
    return axios.post(`${baseURL}acessoMenuUsuario`,data);
} 

const getAcessoGrupoMenu = (data)=>{
    return axios.post(`${baseURL}listarAcessoPorGrupo`,data);
} 






const api = axios.create({baseURL});

module.exports = {getAcessoGrupoMenu,getAcessoUserMenu,saveAcesso,getAcessoUsu,getAcesso,deleteGrupoAcesso,saveGrupoAcesso,getGrupoAcesso,api,saveUsuario,loginUsuario,getUsuarios,deleteUsuario};