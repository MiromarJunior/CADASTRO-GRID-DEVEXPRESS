const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB/configDB.js");
const { formataArrayStr } = require("../Service/utilServiceBackEnd.js");
const { route } = require("../UsuarioController/usuarioController.js");
const app = express();
app.use(express.json());


router.post("/listarUnidadeFederativa", async(req, res)=> {
    const {token  
  } =req.body;
  
  
  
      let connection = await oracledb.getConnection(dbConfig);
      let result;
      let selectSql = "";
      
  
    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{  
          result = await connection.execute ( 
            ` 
            SELECT * FROM UNIDADE_FEDERATIVA  
         
              
            `,
            [ ],
            { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
           
          } 
             );
             
           
             res.send(result.rows).status(200).end();           
        }
    })      
        
    } catch (error) {
        console.error(error);
        res.send("erro de conexao").status(500);
        
    }finally {
        if(connection){
            try {
                await connection.close();
              
            } catch (error) {
              console.error(error);              
            }
        }
    }
  
  
  
  
  });

  module.exports  = router;