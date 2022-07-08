const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 5000;
app.use(express.json());

app.use(cors({origin : [process.env.URL_FRONT_END,process.env.URL_FRONT_END4,process.env.URL_FRONT_END2,process.env.URL_FRONT_END3] }));

app.use(express.urlencoded({
    extended : true
}));


app.listen(port, ()=>{ 

  let usuarioRotas = require("./Controller/usuarioController");
  app.use("/",usuarioRotas)  ;
 

  let seguradoraRotas = require("./Controller/seguradoraController");
  app.use("/",seguradoraRotas) ;

  let unidadeFederativaRotas = require("./Controller/unidadeFederativaController");
  app.use("/",unidadeFederativaRotas) ;

  let categMsgsRotas = require("./Controller/categoriamensagensController");
  app.use("/",categMsgsRotas) ;

  let grupoItemRotas = require("./Controller/grupoitemController");
  app.use("/",grupoItemRotas) ;

  let SubgrupoItemRotas = require("./Controller/SubgrupoitemController");
  app.use("/",SubgrupoItemRotas) ;


  console.log("Servidor online na porta  : ", port);
  




});