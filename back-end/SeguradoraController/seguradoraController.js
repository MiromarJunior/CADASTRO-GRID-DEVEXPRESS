const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB/configDB.js");
const { route } = require("../UsuarioController/usuarioController.js");
const app = express();
app.use(express.json());
// let connection = await oracledb.getConnection(dbConfig);
//await connection.execute(`alter session set nls_date_format = 'DD/MM/YYYY hh24:mi:ss'`); 


router.post("/cadastrarSeguradora", async(req, res)=> {
  const {codLegado, cnpjSeguradora  , tipoPessoa,optSimples,statusSeg,
    razaoSocial, nomeFantasia, ie, im,
    logradouro, complemento, bairro, estadoUF, nrLogradouro, cep,
    nomeCidade, smtpSist, portaSist, emailSist, senhaEmailSist,
    remetenteEmailSist, nomeRemetenteEmailSist, smtpSistAuth ,smtpSistSecure,
    soapRetSol, soapRetNotas, nomeContatoSeg, funcaoContatoSeg, departContatoSeg,
    emailContato, urlContato, dddContatoCel, nrContatoCel ,operadoraContato, dddContatoCom,
    nrContatoCom, ramalContato, 
    token





} =req.body;



    let connection = await oracledb.getConnection(dbConfig);
    let result;

  try {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.log(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

      } else{  
        result = await connection.execute ( 
          ` INSERT INTO SEGURADORA(ID_SEGURADORA,
            SGRA_CNPJ,
            SGRA_ID_LEGADO,
            SGRA_NATUREZA_JURIDICA,
            SGRA_NOME_FANTASIA,
            SGRA_RAZAO_SOCIAL,
            SGRA_OPTANTE_SIMPLES_NACIONAL,
            SGRA_STATUS,
            SGRA_INSCRICAO_ESTADUAL,
            SGRA_INSCRICAO_MUNICIPAL,
            SGRA_CEP,
            SGRA_CIDADE,
            ID_UNIDADE_FEDERATIVA,            
            SGRA_NUMERO,
            SGRA_COMPLEMENTO,
            SGRA_BAIRRO,
            SGRA_SMTP,
            SGRA_PORTA,
            SGRA_USUARIO_EMAIL,
            SRGA_SENHA,
            SGRA_REMETENTE,
            SGRA_NOME_REMETENTE,
            SGRA_SMTP_AUTH,
            SGRA_SMTP_SECURE,
            SGRA_RETORNO_SOLICITACAO,
            SGRA_RETORNO_NOTAS,
            SGRA_RUA)
            VALUES(SQ_SEG.NEXTVAL, : CNPJ, :CODLEG, :TIPOP, :NOMEFAN, :RAZAOSOC, :OPTSIM,
                :STATUSSEG, :IE, :IM, :CEP, :NOMECID, :UF, :NR, :COMPLE, :BAIRRO, :SMTPSIS,
                :PORTASIST, :EMAILSIS, :SENHAEMAILSIS, :REMETE, :NOMEREME, :SMTPAUTH,
                :SMTPSECURE, :SOAPSOL, :SOAPNOT, :LOGR
            
            
            )
          `,
          [cnpjSeguradora,codLegado, tipoPessoa,
            nomeFantasia,razaoSocial, optSimples,statusSeg,ie, im,
            cep, nomeCidade,estadoUF,nrLogradouro, complemento,bairro,
            smtpSist, portaSist, emailSist, senhaEmailSist,remetenteEmailSist, nomeRemetenteEmailSist, 
            smtpSistAuth ,smtpSistSecure,soapRetSol, soapRetNotas,
            logradouro  ],
          { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
            autoCommit :  true
        } 
           );
         
           res.send("sucesso").status(200).end();           
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

router.post("/cadastrarContatoSeguradora", async(req, res)=> {
    const {
        
        
        
       
      token
  
    //   nomeContatoSeg, funcaoContatoSeg, departContatoSeg,
    //   emailContato, urlContato, dddContatoCel, nrContatoCel ,operadoraContato, dddContatoCom,
    //   nrContatoCom, ramalContato, 
  
  
  
  } =req.body;
  console.log(req.body);
  
  
  
      let connection = await oracledb.getConnection(dbConfig);
      let result;
  
    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.log(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{  
          result = await connection.execute ( 
            ` 
              
            
            `,
            [ ],
            { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
              autoCommit :  true
          } 
             );
           
             res.send("sucesso").status(200).end();           
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


  router.post("/listarSeguradora", async(req, res)=> {
    const {token  
  } =req.body;
  
  
  
      let connection = await oracledb.getConnection(dbConfig);
      let result;
  
    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.log(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{  
          result = await connection.execute ( 
            ` 
              SELECT * FROM SEGURADORA
              
              
              
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