const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const port = 5000;
app.use(express.json());

app.use(cors({origin : [process.env.URL_FRONT_END, process.env.URL_FRONT_END2] }));

app.use(express.urlencoded({
    extended : true
}));


app.listen(port, ()=>{ 

  let usuarioRotas = require("./UsuarioController/usuarioController");
  app.use("/",usuarioRotas)  ;
 
  let produtoRotas = require("./ProdutoController/produtoController");
  app.use("/",produtoRotas) ;

  let seguradoraRotas = require("./SeguradoraController/seguradoraController");
  app.use("/",seguradoraRotas) ;

  let unidadeFederativaRotas = require("./EnderecoController/unidadeFederativaController");
  app.use("/",unidadeFederativaRotas) ;


  console.log("Servidor online na porta  : ", port);
  




});