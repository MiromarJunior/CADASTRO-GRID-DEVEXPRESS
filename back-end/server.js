const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 5000;
app.use(express.json());

app.use(cors({origin : process.env.URL_FRONT_END }));

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


  console.log("Servidor online na porta  : ", port);
  




});