/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários
*/

const { default : axios} = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveMunicipios = data=>{
    return axios.post(`${baseURL}cadastrarMunicipios`,data);
} 

const getMunicipios = data=>{
    return axios.post(`${baseURL}listarMunicipios`,data);

} 

const deleteMunicipiosID = data=>{
    return axios.post(`${baseURL}excluirMunicipios`,data);
}

module.exports = {saveMunicipios, getMunicipios, deleteMunicipiosID};