/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários
*/

const { default: axios } = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveSac = (data) => {
  // return axios.post(`${baseURL}cadastrarUsuario`, data);
  return axios.post(`${baseURL}cadastrarSac`, data);
};

const getSacMontadoras = (data) => {
  return axios.post(`${baseURL}listarSac`, data);
};
const deleteSac = (data) => {
  return axios.post(`${baseURL}excluirSac`, data);
};

const api = axios.create({ baseURL });

module.exports = {
  saveSac,
  getSacMontadoras,
  deleteSac,
};
