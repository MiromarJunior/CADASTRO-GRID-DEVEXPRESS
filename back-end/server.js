const express = require("express");
const app = express();
const cors = require("cors");
// const {
//   default: SacMontadoras,
// } = require("../front-end/src/Pages/SacMontadoras/sacMontadoras");
require("dotenv").config();
const port = 5000;
app.use(express.json());

app.use( cors({origin: [process.env.URL_FRONT_END, process.env.URL_FRONT_END4, process.env.URL_FRONT_END2, process.env.URL_FRONT_END3] }));

app.use(  express.urlencoded({extended: true }));

app.listen(port, () => {
  let usuarioRotas = require("./Controller/usuarioController");

  app.use("/", usuarioRotas);

  let seguradoraRotas = require("./Controller/seguradoraController");
  app.use("/", seguradoraRotas);

  let unidadeFederativaRotas = require("./Controller/unidadeFederativaController");
  app.use("/", unidadeFederativaRotas);

  let categMsgsRotas = require("./Controller/categoriamensagensController");
  app.use("/", categMsgsRotas);

  let grupoItemRotas = require("./Controller/grupoitemController");
  app.use("/", grupoItemRotas);

  let SubgrupoItemRotas = require("./Controller/SubgrupoitemController");
  app.use("/", SubgrupoItemRotas);

  let marcaVeiculoRotas = require("./Controller/marcaVeiculoController");
  app.use("/", marcaVeiculoRotas);


  let justificativaItemRotas = require('./Controller/justificativaItemController');
  app.use('/', justificativaItemRotas);

  let municipiosRotas = require('./Controller/municipiosController');
  app.use('/', municipiosRotas);

  let regiaoRotas = require('./Controller/regiaoController');
  app.use('/', regiaoRotas);
  
  let sacMontadoraRotas = require("./Controller/sacMontadorasController");
  app.use("/", sacMontadoraRotas);

  let parametrosLeilao = require("./Controller/parametrosLeilaoController");
  app.use("/", parametrosLeilao);
  
  let fornecedorRotas = require("./Controller/fornecedorController");
  app.use("/",fornecedorRotas) ;

  let tipoPecas = require("./Controller/tipoPeca");
  app.use("/",tipoPecas);

  let statusItem = require("./Controller/statusItem");
  app.use("/",statusItem);

  console.log("Servidor online na porta  : ", port);
});

