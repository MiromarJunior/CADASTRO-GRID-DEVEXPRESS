// Pagina utilizando o
//  axios para fazer a ligação entre back-end e front-end das chamadas
//  referente aos processos dos Usuarios.

const { default: axios } = require("axios");

const baseURL = process.env.REACT_APP_API_URL;

const getSacMontadora = (data) => {
  return axios.post(`${baseURL}ListarSacMontadoras`, data);
};

module.exports = { getSacMontadora };
