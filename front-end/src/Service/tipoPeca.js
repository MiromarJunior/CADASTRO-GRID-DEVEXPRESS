/*
Pagina utiliza axios para fazer a ligação entre back-end e front-end das chamadas referente aos usuários
*/

const { default: axios } = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const saveTipoPeca = (data) => {
  return axios.post(`${baseURL}saveTipoPeca`, data);
};

const getTipoPeca = (data) => {
  return axios.post(`${baseURL}listarTipoPeca`, data);
};
const deleteTipoPeca = (data) => {
  return axios.post(`${baseURL}excluirTipoPeca`, data);
};

const api = axios.create({ baseURL });

module.exports = { saveTipoPeca, getTipoPeca, deleteTipoPeca };
