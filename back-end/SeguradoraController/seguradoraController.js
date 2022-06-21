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
// let connection = await oracledb.getConnection(dbConfig);
//await connection.execute(`alter session set nls_date_format = 'DD/MM/YYYY hh24:mi:ss'`); 


router.post("/cadastrarSeguradora", async(req, res)=> {
  let {codLegado, cnpjSeguradora  , tipoPessoa,optSimples,statusSeg,
    razaoSocial, nomeFantasia, ie, im,
    logradouro, complemento, bairro, estadoUF, nrLogradouro, cep,
    nomeCidade, smtpSist, portaSist, emailSist, senhaEmailSist,
    remetenteEmailSist, nomeRemetenteEmailSist, smtpSistAuth ,smtpSistSecure,
    soapRetSol, soapRetNotas,idSeg, token} =req.body;
let insertSql;
let selectSql;
let updateSql;



    let connection = await oracledb.getConnection(dbConfig);  



    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

      } else{  

        insertSql = (
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
          `
        )

        selectSql =(
          `SELECT SEG.ID_SEGURADORA FROM SEGURADORA SEG
          WHERE SEG.SGRA_CNPJ = :CNPJsEG         
        `
        )

        updateSql = (
          ` UPDATE SEGURADORA
            SET SGRA_ID_LEGADO = '${codLegado}',       
            SGRA_NATUREZA_JURIDICA = '${tipoPessoa}',
            SGRA_NOME_FANTASIA = '${nomeFantasia}',
            SGRA_RAZAO_SOCIAL = '${razaoSocial}',
            SGRA_OPTANTE_SIMPLES_NACIONAL = '${optSimples}',
            SGRA_STATUS = '${statusSeg}',
            SGRA_INSCRICAO_ESTADUAL = '${ie}',
            SGRA_INSCRICAO_MUNICIPAL = '${im}',
            SGRA_CEP = ${cep},
            SGRA_CIDADE = '${nomeCidade}',
            ID_UNIDADE_FEDERATIVA = '${estadoUF}',            
            SGRA_NUMERO = '${nrLogradouro}',
            SGRA_COMPLEMENTO = '${complemento}',
            SGRA_BAIRRO = '${bairro}',
            SGRA_SMTP = '${smtpSist}',
            SGRA_PORTA = '${portaSist}',
            SGRA_USUARIO_EMAIL = '${emailSist}',
            SRGA_SENHA = '${senhaEmailSist}',
            SGRA_REMETENTE = '${remetenteEmailSist}',
            SGRA_NOME_REMETENTE = '${nomeRemetenteEmailSist}',
            SGRA_SMTP_AUTH = '${smtpSistAuth}',
            SGRA_SMTP_SECURE = '${smtpSistSecure}',
            SGRA_RETORNO_SOLICITACAO = '${soapRetSol}',
            SGRA_RETORNO_NOTAS = '${soapRetNotas}',
            SGRA_RUA = '${logradouro}'
            WHERE ID_SEGURADORA = ${idSeg}
          `
        )                   
                   
      }
  })  

  try {  


    if(idSeg > 0){
   
      await connection.execute (     
        updateSql
        ,
        [],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });
      
    }else{
      
      await connection.execute (     
        insertSql
        ,
        [cnpjSeguradora,codLegado, tipoPessoa,
          nomeFantasia,razaoSocial, optSimples,statusSeg,ie, im,
          cep, nomeCidade,estadoUF, nrLogradouro, complemento,bairro,
          smtpSist, portaSist, emailSist, senhaEmailSist,remetenteEmailSist, nomeRemetenteEmailSist, 
          smtpSistAuth ,smtpSistSecure,soapRetSol, soapRetNotas,
          logradouro  ],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });

    }
  
  

  let result =  await connection.execute( selectSql
    ,
     [cnpjSeguradora ],
     { outFormat  :  oracledb.OUT_FORMAT_OBJECT
      
   });   
   res.send(result.rows).status(200).end(); 
          
  } catch (error) {
    
      console.error("erro aqui",error);
      res.send("erroSalvar").status(500);
      
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
  const {token,idSeg  
} =req.body;



    let connection = await oracledb.getConnection(dbConfig);
    let result;
    let selectSql = "";
    if(idSeg > 0){
     selectSql =  `WHERE ID_SEGURADORA = ${idSeg}`
    }

  try {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

      } else{  
        result = await connection.execute ( 
          ` 
          SELECT * FROM SEGURADORA  
          ${selectSql}
            
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
router.post("/excluirSeguradora", async(req, res)=> {
  const {token,idSeg  
} =req.body;


    let connection = await oracledb.getConnection(dbConfig);


let deleteSql = "";
let deleteSql1 = "";

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

      } else{  

        deleteSql =(
          ` 
          DELETE FROM SEGURADORA 
          WHERE  ID_SEGURADORA = ${idSeg}
           
          `

        )

        deleteSql1 = (
          ` 
          DELETE FROM SEGURADORA_CONTATO SE
WHERE SE.ID_SEGURADORA =  ${idSeg}
           
          `

        )






     
        
         
                    
      }
  })  
  try {
  await connection.execute( deleteSql
    ,
     [],
     { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
       autoCommit : true
    
   });
   await connection.execute( deleteSql1
    ,
     [],
     { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
       autoCommit : true
    
   });
   res.send("sucesso").status(200).end();  
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
      token,idSeg,contatos  
  
  
  } =req.body;


  
      let connection = await oracledb.getConnection(dbConfig);
      let result;  
    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{  
          contatos.map(async(l)=>{



            if(l.ID_SEGURADORA_CONTATO){

              await connection.execute(
                `
                UPDATE  SEGURADORA_CONTATO
                 SET  SGCO_NOME = '${l.SGCO_NOME}',
                  SGCO_FUNCAO = '${l.SGCO_FUNCAO}',
                  SGCO_DEPARTAMENTO = '${l.SGCO_DEPARTAMENTO}',
                  SGCO_EMAIL ='${l.SGCO_EMAIL}',
                  SGCO_URL='${l.SGCO_URL}',
                  SGCO_CELULAR_DDD ='${l.SGCO_CELULAR_DDD}',
                  SGCO_CELULAR_NUMERO ='${l.SGCO_CELULAR_NUMERO}',
                  SGCO_CELULAR_OPERADORA ='${l.SGCO_CELULAR_OPERADORA}',
                  SGCO_FONE_COMERCIAL_DDD ='${l.SGCO_FONE_COMERCIAL_DDD}',
                  SGCO_FONE_COMERCIAL_NUMERO ='${l.SGCO_FONE_COMERCIAL_NUMERO}',
                  SGCO_FONE_COMERCIAL_RAMAL ='${l.SGCO_FONE_COMERCIAL_RAMAL}',
                  ID_SEGURADORA ='${l.ID_SEGURADORA}'
                  WHERE ID_SEGURADORA_CONTATO = '${l.ID_SEGURADORA_CONTATO}'
                
                `

              ,[],{outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit :  true})

            }else{

          
            await connection.execute (               ` 
              INSERT INTO SEGURADORA_CONTATO(
                ID_SEGURADORA_CONTATO,
                SGCO_NOME,
                SGCO_FUNCAO,
                SGCO_DEPARTAMENTO,
                SGCO_EMAIL,
                SGCO_URL,
                SGCO_CELULAR_DDD,
                SGCO_CELULAR_NUMERO,
                SGCO_CELULAR_OPERADORA,
                SGCO_FONE_COMERCIAL_DDD,
                SGCO_FONE_COMERCIAL_NUMERO,
                SGCO_FONE_COMERCIAL_RAMAL,
                ID_SEGURADORA
              )
              VALUES(
                SQ_SEG_CONT.NEXTVAL,
                '${l.SGCO_NOME}','${l.SGCO_FUNCAO}','${l.SGCO_DEPARTAMENTO}','${l.SGCO_EMAIL}','${l.SGCO_URL}','${l.SGCO_CELULAR_DDD}',
                '${l.SGCO_CELULAR_NUMERO}','${l.SGCO_CELULAR_OPERADORA}','${l.SGCO_FONE_COMERCIAL_DDD}','${l.SGCO_FONE_COMERCIAL_NUMERO}',
                '${l.SGCO_FONE_COMERCIAL_RAMAL}','${idSeg}'
              )             
              
              `,
              [] ,
              { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit :  true
            });
          }
            
          })
          
      
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

  router.post("/listarContatoSeguradora", async(req, res)=> {
    const {token,idSeg  
  } =req.body;  


      let connection = await oracledb.getConnection(dbConfig);
      let result;
  
    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{  
          result = await connection.execute ( 
            ` 
            SELECT * FROM SEGURADORA_CONTATO SECO
            WHERE SECO.ID_SEGURADORA = :IDSEG
              
              
              
            `,
            [ idSeg],
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
  router.post("/excluirContatoSeguradora", async(req, res)=> {
    const {token,  idCont
  } =req.body;
  
  
      let connection = await oracledb.getConnection(dbConfig);
  
  
  let deleteSql = "";

  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{  
  
          deleteSql =(
            ` 
            DELETE FROM SEGURADORA_CONTATO 
            WHERE  ID_SEGURADORA_CONTATO = ${idCont}
             
            `  
          )
                        
        }
    })  
    try {
    await connection.execute( deleteSql
      ,
       [],
       { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
         autoCommit : true
      
     });
    
     res.send("sucesso").status(200).end();  
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