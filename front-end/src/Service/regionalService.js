/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários
*/

const { default: axios } = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveRegional = (data) => {
  return axios.post(`${baseURL}saveRegional`, data);
};

const getRegional = (data) => {
  return axios.post(`${baseURL}listarRegional`, data);
};
const deleteRegional = (data) => {
  return axios.post(`${baseURL}excluirRegional`, data);
};

const api = axios.create({ baseURL });

module.exports = { saveRegional, getRegional, deleteRegional };
