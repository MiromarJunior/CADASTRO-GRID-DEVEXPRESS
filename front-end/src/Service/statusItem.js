
/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários
*/

const { default: axios } = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveStatusItem = (data) => {
  return axios.post(`${baseURL}saveStatusItem`, data);
};

const getStatusItem = (data) => {
  return axios.post(`${baseURL}listarStatusItem`, data);
};
const deleteStatusItem = (data) => {
  return axios.post(`${baseURL}excluirStatusItem`, data);
};

const api = axios.create({ baseURL });

module.exports = { saveStatusItem, getStatusItem, deleteStatusItem };
