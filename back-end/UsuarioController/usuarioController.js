/*
componentes utilizados
#express
#jsonwebtoken
#oracledb
#bcrypt

/cadastrarUsuario recebe dados do fornt-end para cadastrar um novo usuário, 
mas antes verifica se o nome e cpf já estão cadastrados no banco.

/loginUsuario recebe o usuario e senha e faz a comparação para validar o login 
e responde com os dados de autenticação
 exclui os produtos recebidos pelo nr ID



*/



const router = require("express").Router();
const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB/configDB.js");
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;


// router.get("/listar", async(req, res)=> {
//     let connection = await oracledb.getConnection(dbConfig);
//     let result;

//   try {

//     result = await connection.execute ( 

//         ` SELECT  * FROM USUARIO  `,
//         [],
//         { outFormat  :  oracledb.OUT_FORMAT_OBJECT} 
//          );
//          res.send(result.rows).status(200);
        
    
      
//   } catch (error) {
//       console.error(error);
//       res.send("erro de conexao").status(500);
      
//   }finally {
//       if(connection){
//           try {
//               await connection.close();
//               console.log("conexão fechada");
//           } catch (error) {
//             console.error(error);              
//           }
//       }
//   }




// });


router.post("/cadastrarUsuario", async(req, res)=> {
  let ={nome, usuario, dataNasc, senha, cpf} =req.body
  let connection = await oracledb.getConnection(dbConfig);
  await connection.execute(`alter session set nls_date_format = 'DD/MM/YYYY hh24:mi:ss'`);
  let result;
  let erroAcesso = "";
  const senhaC = bcrypt.hashSync(senha,saltRounds);
  let data_brasileira = dataNasc.split('-').reverse().join('/');
 


try {
  let result = await connection.execute ( 
    ` SELECT CPF FROM USUARIO 
    WHERE CPF = :CPF 
    OR USUARIO.USUARIO = :USUARIO `,

    [cpf,usuario],
    { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
      
    } 
     );
     if(result.rows.length > 0){
      res.send("Usuário ou CPF já cadastrados !\nFavor verificar!!").status(200).end();
     }else{
        await connection.execute ( 
      ` INSERT INTO USUARIO(NOME,
        CPF,
        DT_NASCI,
        USUARIO,
        SENHA)
        VALUES(:NOME, :CPF, :DTNASCI, :USUARIO, :SENHA) `,
  
      [nome, cpf,data_brasileira,usuario,senhaC],
      { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
        autoCommit : true
      } 
       );
       res.send("Usuário Cadastrado com Sucesso !!").status(200).end();
      
     }
    
} catch (error) {
  
    console.error(error);
    res.send("erro ao Cadastrar usuário").status(500);

   
    
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

router.post("/loginUsuario", async(req, res)=> {
  let {usuario, senha} =req.body;
  let connection = await oracledb.getConnection(dbConfig);
  let result;
  let  = usuarioLocal = "";
  let senhaLocal = "";
  let validaSenha = false;
  let token = "";
  
try {

  result = await connection.execute ( 

      ` SELECT *FROM USUARIO USRO
        WHERE USRO.USUARIO =:USUARIO  `,
      [usuario],
      { outFormat  :  oracledb.OUT_FORMAT_OBJECT} 
       );     

       if(result.rows.length > 0){
         result.rows.map((l)=>{
           usuarioLocal = l.USUARIO;
           senhaLocal = l.SENHA;
         });
         validaSenha = bcrypt.compareSync(senha,senhaLocal);
         if(usuarioLocal === usuario && (validaSenha)){
          token = jwt.sign({},SECRET,{expiresIn : "1h"});
          res.send({ Usuario: usuarioLocal, token: token }).status(200).end();
 
        }else{
          res.send("Usuário ou senha inválido").status(200).end();
        }


       }         
       else{
         res.send("Usuário não encontrado !!").status(200).end();
       }
      
      
  
    
} catch (error) {
    console.error(error);
    res.send("erro ao tentar logar").status(500);
    
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







module.exports = router;