/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários


*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveSucursal = data=>{
    return axios.post(`${baseURL}cadastrarSucursal`,data);
} 
const saveContatoSucursal = data=>{
    return axios.post(`${baseURL}cadastrarContatoSucursal`,data);
} 
const getSucursal = data=>{
    return axios.post(`${baseURL}listarSucursal`,data);
} 
const deleteSucursalID = data=>{
    return axios.post(`${baseURL}excluirSucursal`,data);
}
const getContatoSucursal = data=>{
    return axios.post(`${baseURL}listarContatoSucursal`,data);
}
const deleteContatoSucursalID = data=>{
    return axios.post(`${baseURL}excluirContatoSucursal`,data);
}

module.exports = {deleteContatoSucursalID,deleteSucursalID,getContatoSucursal,getSucursal,saveSucursal,saveContatoSucursal};