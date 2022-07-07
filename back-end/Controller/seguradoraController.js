const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dbConfig = require("../ConfigDB/configDB.js");
const { apenasNr } = require("../Service/utilServiceBackEnd.js");


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
    soapRetSol, soapRetNotas,idSeg, token, acessoGeral} =req.body;
let insertSql;
let selectSql;
let updateSql;
let idEstado;

const senhaC = bcrypt.hashSync(senhaEmailSist,saltRounds);

    let connection = await oracledb.getConnection(dbConfig);  

    if(acessoGeral){    

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
            SGRA_SENHA,
            SGRA_REMETENTE,
            SGRA_NOME_REMETENTE,
            SGRA_SMTP_AUTH,
            SGRA_SMTP_SECURE,
            SGRA_RETORNO_SOLICITACAO,
            SGRA_RETORNO_NOTAS,
            SGRA_RUA)
            VALUES(SEQ_SEGU.NEXTVAL, : CNPJ, :CODLEG, :TIPOP, :NOMEFAN, :RAZAOSOC, :OPTSIM,
                :STATUSSEG, :IE, :IM, :CEP, :NOMECID, :UF, :NR, :COMPLE, :BAIRRO, :SMTPSIS,
                :PORTASIST, :EMAILSIS, :SENHAEMAILSIS, :REMETE, :NOMEREME, :SMTPAUTH,
                :SMTPSECURE, :SOAPSOL, :SOAPNOT, :LOGR
            
            
            )
          `
        )

        updateSql = (
          ` UPDATE SEGURADORA
          SET SGRA_ID_LEGADO = :CODL,       
          SGRA_NATUREZA_JURIDICA = :NATJ,
          SGRA_NOME_FANTASIA = :NMFANT,
          SGRA_RAZAO_SOCIAL = :RZSOC,
          SGRA_OPTANTE_SIMPLES_NACIONAL = :OPTS,
          SGRA_STATUS = :STSEG,
          SGRA_INSCRICAO_ESTADUAL = :INE,
          SGRA_INSCRICAO_MUNICIPAL = :INM,
          SGRA_CEP =:CP,
          SGRA_CIDADE = :NMCID,
          ID_UNIDADE_FEDERATIVA = :UNIF,            
          SGRA_NUMERO = :LGNR,
          SGRA_COMPLEMENTO = :COMS,
          SGRA_BAIRRO = :BRR,
          SGRA_SMTP = :SS,
          SGRA_PORTA = :SST,
          SGRA_USUARIO_EMAIL = :USMAIL,
          SGRA_SENHA = :SNEM,
          SGRA_REMETENTE = :REM,
          SGRA_NOME_REMETENTE = :NMREM,
          SGRA_SMTP_AUTH = :SSMM,
          SGRA_SMTP_SECURE = :SSSC,
          SGRA_RETORNO_SOLICITACAO = :RESO,
          SGRA_RETORNO_NOTAS = :RENS,
          SGRA_RUA = :RLO
          WHERE ID_SEGURADORA = :SEGI
        `

        )

        selectSql =(
          `SELECT SEG.ID_SEGURADORA FROM SEGURADORA SEG
          WHERE SEG.SGRA_CNPJ = :CNPJsEG         
        `
        )                       
                   
      }
  });  

  try {  
    let estado = await connection.execute (  
      `
      SELECT ID_UNIDADE_FEDERATIVA FROM UNIDADE_FEDERATIVA
      WHERE UNFE_SIGLA = :ESF
      `
      ,
      [estadoUF],
      { outFormat  :  oracledb.OUT_FORMAT_ARRAY,
        autoCommit :  true
    }); 
     idEstado = (estado.rows).toString();  

    if(idSeg > 0){   
      await connection.execute (     
       updateSql
        ,
        [codLegado, tipoPessoa, nomeFantasia,razaoSocial, optSimples,statusSeg,ie, im,
          cep, nomeCidade,idEstado, nrLogradouro, complemento,bairro,
          smtpSist, portaSist, emailSist, senhaC,remetenteEmailSist, nomeRemetenteEmailSist, 
          smtpSistAuth ,smtpSistSecure,soapRetSol, soapRetNotas,
          logradouro,idSeg],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });
      
    }else{
      
      await connection.execute (     
        insertSql
        ,
        [cnpjSeguradora,codLegado, tipoPessoa,
          nomeFantasia,razaoSocial, optSimples,statusSeg,ie, im,
          cep, nomeCidade,idEstado, nrLogradouro, complemento,bairro,
          smtpSist, portaSist, emailSist, senhaC,remetenteEmailSist, nomeRemetenteEmailSist, 
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

}else{
  res.send("semAcesso").status(200).end();
}


});

router.post("/listarSeguradora", async(req, res)=> {
  const {token,idSeg,   
} =req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;
    let selectSql = "";
    if(idSeg > 0){
     selectSql =  `AND ID_SEGURADORA = ${idSeg}`
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
          SELECT  * FROM SEGURADORA SEG, UNIDADE_FEDERATIVA UF
          WHERE SEG.ID_UNIDADE_FEDERATIVA = UF.ID_UNIDADE_FEDERATIVA(+)
          ${selectSql}
            
          `,
          [],
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
  const {token,idSeg, acessoGeral  
} =req.body;


    let connection = await oracledb.getConnection(dbConfig);


let deleteSql = "";
let deleteSql1 = "";

if(acessoGeral){

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
  await connection.execute( deleteSql1
    ,
     [],
     { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
       autoCommit : true
    
   });
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

}else{
  res.send("semAcesso").status(200).end();
}


});

router.post("/cadastrarContatoSeguradora", async(req, res)=> {
    const {
      token,idSeg,contatos, acessoGeral   } =req.body; 
      let connection = await oracledb.getConnection(dbConfig);

      let nomeCont = contatos.SGCO_NOME,
          funcaoCont = contatos.SGCO_FUNCAO,
          departCont = contatos.SGCO_DEPARTAMENTO,
          emailCont = contatos.SGCO_EMAIL,
          urlCont = contatos.SGCO_URL,
          dddCelCont = contatos.SGCO_CELULAR_DDD,
          nrCelCont = contatos.SGCO_CELULAR_NUMERO,
          operaCont = contatos.SGCO_CELULAR_OPERADORA,
          dddComCont = contatos.SGCO_FONE_COMERCIAL_DDD,
          nrComCont = contatos.SGCO_FONE_COMERCIAL_NUMERO,
          ramalCont = contatos.SGCO_FONE_COMERCIAL_RAMAL,
          idCont = contatos.ID_SEGURADORA_CONTATO;
     
          if(acessoGeral){
    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{              

            if(idCont){
              await connection.execute(                `
                UPDATE  SEGURADORA_CONTATO
                 SET  SGCO_NOME = '${nomeCont}',
                  SGCO_FUNCAO = '${funcaoCont}',
                  SGCO_DEPARTAMENTO = '${departCont}',
                  SGCO_EMAIL ='${emailCont}',
                  SGCO_URL='${urlCont}',
                  SGCO_CELULAR_DDD ='${apenasNr(dddCelCont)}',
                  SGCO_CELULAR_NUMERO ='${apenasNr(nrCelCont)}',
                  SGCO_CELULAR_OPERADORA ='${operaCont}',
                  SGCO_FONE_COMERCIAL_DDD ='${apenasNr(dddComCont)}',
                  SGCO_FONE_COMERCIAL_NUMERO ='${ apenasNr(nrComCont)}',
                  SGCO_FONE_COMERCIAL_RAMAL ='${apenasNr(ramalCont)}',
                  ID_SEGURADORA ='${idSeg}'
                  WHERE ID_SEGURADORA_CONTATO = '${idCont}'                
                `

              ,[],{outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit :  true});
                res.send("sucesso").status(200).end();  

            }else{
          
            await connection.execute (              
               ` 
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
                SEQ_SECO.NEXTVAL,
                '${nomeCont}','${funcaoCont}','${departCont}','${emailCont}','${urlCont}','${apenasNr(dddCelCont)}',
                '${apenasNr(nrCelCont)}','${operaCont}','${apenasNr(dddComCont)}','${apenasNr(nrComCont)}',
                '${apenasNr(ramalCont)}','${idSeg}'
              )           
              
              `,
              [] ,
              { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit :  true
            });
            res.send("sucesso").status(200).end();  
          }
            
          
      
                      
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
  
  }else{
    res.send("semAcesso").status(200).end();
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
    const {token,  idCont, acessoGeral
  } =req.body;

  
      let connection = await oracledb.getConnection(dbConfig);
  
  
  let deleteSql = "";
  if(acessoGeral){
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
  
  }else{
    res.send("semAcesso").status(200).end();
  }
  
  
  });
  

  router.post("/listarAcessoSeguradora", async (req, res) => {
    const { token, idGa } = req.body;
    let connection = await oracledb.getConnection(dbConfig);
    let result;
  
  
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();
  
      } else {
        try {
  
          result = await connection.execute(
            `     
            SELECT ACES.ACES_SGRA_DESCRICAO, COUNT(DISTINCT ACGR.GRAC_CODIGO) AS TOTAL,GRAC.GRAC_CODIGO,ACES.ACES_SGRA_CODIGO  
            FROM ACESSO_SGRA ACES ,ACES_SGRA_GRAC ACGR, GRUPO_ACESSO GRAC
            WHERE ACGR.ACES_SGRA_CODIGO(+) = ACES.ACES_SGRA_CODIGO 
            AND GRAC.GRAC_CODIGO(+) = ACGR.GRAC_CODIGO
            AND ACGR.GRAC_CODIGO(+) = ${idGa}
            GROUP BY ACES.ACES_SGRA_DESCRICAO,GRAC.GRAC_CODIGO,ACES.ACES_SGRA_CODIGO   
            ORDER BY ACES.ACES_SGRA_DESCRICAO
              
              `,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
          );
          res.send(result.rows).status(200).end();
  
  
        } catch (error) {
          console.error("Erro ao listar acesso Seguradora",error);
          res.send("erro de conexao").status(500).end();
  
        } finally {
          if (connection) {
            try {
              await connection.close();
  
            } catch (error) {
              console.error(error);
            }
          }
        }
  
      }
    })
  
  
  });
  
  router.post("/cadastrarAcessoSGRA", async (req, res) => {
    const { token, idGa, idAc, acessoGeral } = req.body;
    let connection = await oracledb.getConnection(dbConfig);
    let result;
  
  
  if(acessoGeral){
  
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();
  
      } else {
        try {
  
          let resultAce = await connection.execute(
            `     
            SELECT * FROM ACES_SGRA_GRAC AG
            WHERE AG.GRAC_CODIGO = ${idGa}
            AND AG.ACES_SGRA_CODIGO = ${idAc}
            
            `,
            [],
            {
              outFormat: oracledb.OUT_FORMAT_OBJECT,
              autoCommit: true
  
            }
          );
  
          if (resultAce.rows.length > 0) {
            result = await connection.execute(
              `
                DELETE FROM ACES_SGRA_GRAC
                WHERE GRAC_CODIGO = ${idGa}
                AND ACES_SGRA_CODIGO =  ${idAc}     
                
                
                `,
              [],
              {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true
  
              }
            );
            result.rowsAffected > 0 ? res.send("sucessoD").status(200).end() : res.send("erro").status(200).end();
  
          } else {
            result = await connection.execute(
              `     
                INSERT INTO ACES_SGRA_GRAC(
                  GRAC_CODIGO, ACES_SGRA_CODIGO)
                  VALUES(${idGa},${idAc})
                
                `,
              [],
              {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true
  
              }
            );
            result.rowsAffected > 0 ? res.send("sucesso").status(200).end() : res.send("erro").status(200).end();
  
  
          }
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
        } catch (error) {
          console.error(error);
          res.send("erro de conexao").status(500).end();
  
        } finally {
          if (connection) {
            try {
              await connection.close();
  
            } catch (error) {
              console.error(error);
            }
          }
        }
  
      }
    })
  }else{
    res.send("semAcesso").status(200).end();
  }
  
  });  


 

module.exports  = router;