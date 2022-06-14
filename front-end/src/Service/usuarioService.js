const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveUsuario = data=>{
    return axios.post(`${baseURL}cadastrarUsuario`,data);
} 
const loginUsuario = (data)=>{
    return axios.post(`${baseURL}loginUsuario`,data);
} 



const api = axios.create({baseURL});

module.exports = {api,saveUsuario,loginUsuario};