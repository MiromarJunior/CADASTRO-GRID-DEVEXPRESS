/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const getCategMsgs = (data)=>{
    return axios.post(`${baseURL}listarCategMsgs`,data);
} 

const deleteCategMsgs = (data)=>{
    return axios.post(`${baseURL}excluirCategMsgs`,data);
} 

const saveCategMsgs = data=>{
    return axios.post(`${baseURL}cadastrarCategMsgs`,data);
} 

const api = axios.create({baseURL});

module.exports = {getCategMsgs, deleteCategMsgs, saveCategMsgs};