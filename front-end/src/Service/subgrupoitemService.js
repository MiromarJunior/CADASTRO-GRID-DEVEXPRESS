
const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const getSubGrupoItem = (data)=>{
    return axios.post(`${baseURL}listarSubGrupoItem`,data);
} 

const deleteSubGrupoItem = (data)=>{
    return axios.post(`${baseURL}excluirSubGrupoItem`,data);
} 

const saveSubGrupoItem = data=>{
    return axios.post(`${baseURL}cadastrarSubGrupoItem`,data);
} 
const getGrupoItem = data=>{
    return axios.post(`${baseURL}buscaGrupoItem`,data);
} 


const api = axios.create({baseURL});

module.exports = {getSubGrupoItem, deleteSubGrupoItem, saveSubGrupoItem, getGrupoItem};