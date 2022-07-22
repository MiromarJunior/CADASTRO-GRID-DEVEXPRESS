const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dbConfig = require("../ConfigDB/configDB.js");
const { formataArrayStr, apenasNr } = require("../Service/utilServiceBackEnd.js");
const app = express();
app.use(express.json());


router.post("/cadastrarSucursal", async(req, res)=> {
       let {idSucursal,                   
            sualCnpj,                     
            sualIdLegado,                
            sualNaturezaJuridica,        
            sualNomeFantasia,            
            sualRazaoSocial,             
            sualOptanteSimplesNacional, 
            sualStatus,                   
            sualInscricaoEstadual,       
            sualInscricaoMunicipal,      
            sualCep,                      
            sualCidade,                   
            estadoUF,         
            sualRua,                      
            sualNumero,                   
            sualComplemento,              
            sualBairro, 
            token} =req.body;       

let insertSql;
let selectSql;
let updateSql;
let idEstado;

    let connection = await oracledb.getConnection(dbConfig);  

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

      } else{  

        insertSql = (
          `
          INSERT INTO SUCURSAL(ID_SUCURSAL,                   SUAL_CNPJ,                    
                               SUAL_ID_LEGADO,                SUAL_NATUREZA_JURIDICA,       
                               SUAL_NOME_FANTASIA,            SUAL_RAZAO_SOCIAL,            
                               SUAL_OPTANTE_SIMPLES_NACIONAL, SUAL_STATUS,                  
                               SUAL_INSCRICAO_ESTADUAL,       SUAL_INSCRICAO_MUNICIPAL,     
                               SUAL_CEP,                      SUAL_CIDADE,                  
                               ID_UNIDADE_FEDERATIVA,         SUAL_RUA,                     
                               SUAL_NUMERO,                   SUAL_COMPLEMENTO,             
                               SUAL_BAIRRO)
                       VALUES (SEQ_SUAL.NEXTVAL,                :SUAL_CNPJ,                    
                               :SUAL_ID_LEGADO,                 :SUAL_NATUREZA_JURIDICA,       
                               :SUAL_NOME_FANTASIA,             :SUAL_RAZAO_SOCIAL,            
                               :SUAL_OPTANTE_SIMPLES_NACIONAL,  :SUAL_STATUS,                  
                               :SUAL_INSCRICAO_ESTADUAL,        :SUAL_INSCRICAO_MUNICIPAL,    
                               :SUAL_CEP,                       :SUAL_CIDADE,                  
                               :ID_UNIDADE_FEDERATIVA,          :SUAL_RUA,                     
                               :SUAL_NUMERO,                    :SUAL_COMPLEMENTO,             
                               :SUAL_BAIRRO )   
          `
        )

        updateSql = (
          `    UPDATE SUCURSAL
                  SET SUAL_CNPJ                     = :SUAL_CNPJ,                   
                      SUAL_ID_LEGADO                = :SUAL_ID_LEGADO,              
                      SUAL_NATUREZA_JURIDICA        = :SUAL_NATUREZA_JURIDICA,      
                      SUAL_NOME_FANTASIA            = :SUAL_NOME_FANTASIA,         
                      SUAL_RAZAO_SOCIAL             = :SUAL_RAZAO_SOCIAL,           
                      SUAL_OPTANTE_SIMPLES_NACIONAL = :SUAL_OPTANTE_SIMPLES_NACIONAL,
                      SUAL_STATUS                   = :SUAL_STATUS,                 
                      SUAL_INSCRICAO_ESTADUAL       = :SUAL_INSCRICAO_ESTADUAL, 
                      SUAL_INSCRICAO_MUNICIPAL      = :SUAL_INSCRICAO_MUNICIPAL,    
                      SUAL_CEP                      = :SUAL_CEP,                 
                      SUAL_CIDADE                   = :SUAL_CIDADE,       
                      ID_UNIDADE_FEDERATIVA         = :ID_UNIDADE_FEDERATIVA,    
                      SUAL_RUA                      = :SUAL_RUA,
                      SUAL_NUMERO                   = :SUAL_NUMERO,            
                      SUAL_COMPLEMENTO              = :SUAL_COMPLEMENTO,            
                      SUAL_BAIRRO                   = :SUAL_BAIRRO           
                WHERE ID_SUCURSAL                   = :ID_SUCURSAL 
        `
        )
        selectSql =(
          `SELECT ID_SUCURSAL 
             FROM SUCURSAL  
            WHERE SUAL_CNPJ = :SUAL_CNPJ         
        `
        )                       
                   
      }
  });  

  try {  
    let estado = await connection.execute (  
      `
      SELECT ID_UNIDADE_FEDERATIVA 
        FROM UNIDADE_FEDERATIVA
       WHERE UNFE_SIGLA = :ESF
      `
      ,
      [estadoUF],
      { outFormat  :  oracledb.OUT_FORMAT_ARRAY,
        autoCommit :  true
    }); 
    idEstado = (estado.rows).toString();  

    if(idSucursal > 0){   
      await connection.execute (     
       updateSql
        ,
        [ sualCnpj,                     
          sualIdLegado,                
          sualNaturezaJuridica,        
          sualNomeFantasia,            
          sualRazaoSocial,             
          sualOptanteSimplesNacional, 
          sualStatus,                   
          sualInscricaoEstadual,       
          sualInscricaoMunicipal,      
          sualCep,                      
          sualCidade,                   
          idEstado,         
          sualRua,                      
          sualNumero,                   
          sualComplemento,              
          sualBairro,
          idSucursal
        ],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });
      
    }else{
      
      await connection.execute (     
        insertSql
        ,
        [ sualCnpj,                     
          sualIdLegado,                
          sualNaturezaJuridica,        
          sualNomeFantasia,            
          sualRazaoSocial,             
          sualOptanteSimplesNacional, 
          sualStatus,                   
          sualInscricaoEstadual,       
          sualInscricaoMunicipal,      
          sualCep,                      
          sualCidade,                   
          idEstado,         
          sualRua,                      
          sualNumero,                   
          sualComplemento,              
          sualBairro                            
        ],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });

    }

  let result =  await connection.execute( selectSql
    ,
     [sualCnpj ],
     { outFormat  :  oracledb.OUT_FORMAT_OBJECT
      
   });   
   res.send(result.rows).status(200).end(); 
          
  } catch (error) {
    
      console.error("Erro ao tentar cadastrar Sucursal!",error);
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

router.post("/listarSucursal", async(req, res)=> {
    const {token,idSucursal} =req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;
    let selectSql = "";
    if(idSucursal > 0){
     selectSql =  `AND ID_SUCURSAL = ${idSucursal}`
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
          SELECT * 
            FROM SUCURSAL           SUAL, 
                 UNIDADE_FEDERATIVA UNFE
           WHERE SUAL.ID_UNIDADE_FEDERATIVA = UNFE.ID_UNIDADE_FEDERATIVA(+) 
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

router.post("/excluirSucursal", async(req, res)=> {
    const {token,idSucursal} =req.body;
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
          DELETE FROM SUCURSAL  WHERE  ID_SUCURSAL = ${idSucursal}
          `
        )

        deleteSql1 = (
          ` 
          DELETE FROM SUCURSAL_CONTATO WHERE ID_SUCURSAL =  ${idSucursal}
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

});

router.post("/cadastrarContatoSucursal", async(req, res)=> {
    const {token,idSucursal,contatos   } =req.body; 
      let connection = await oracledb.getConnection(dbConfig);
      let sucoNome                = contatos.SUCO_NOME,                  
          sucoFuncao              = contatos.SUCO_FUNCAO,                
          sucoDepartamento        = contatos.SUCO_DEPARTAMENTO,          
          sucoEmail               = contatos.SUCO_EMAIL,                 
          sucoUrl                 = contatos.SUCO_URL,                   
          sucoCelularDdd          = contatos.SUCO_CELULAR_DDD,           
          sucoCelularNumero       = contatos.SUCO_CELULAR_NUMERO,        
          sucoCelularOperadora    = contatos.SUCO_CELULAR_OPERADORA,     
          sucoFoneComercialDdd    = contatos.SUCO_FONE_COMERCIAL_DDD,    
          sucoFoneComercialNumero = contatos.SUCO_FONE_COMERCIAL_NUMERO, 
          sucoFoneComercialRamal  = contatos.SUCO_FONE_COMERCIAL_RAMAL,  
          idSucursalContato       = contatos.ID_SUCURSAL_CONTATO;
                     
    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{              

            if(idSucursalContato){
              await connection.execute(                `
              UPDATE  SUCURSAL_CONTATO
                 SET  SUCO_NOME = '${sucoNome}',
                      SUCO_FUNCAO = '${sucoFuncao}',
                      SUCO_DEPARTAMENTO = '${sucoDepartamento}',
                      SUCO_EMAIL ='${sucoEmail}',
                      SUCO_URL='${sucoUrl}',
                      SUCO_CELULAR_DDD ='${apenasNr(sucoCelularDdd)}',
                      SUCO_CELULAR_NUMERO ='${apenasNr(sucoCelularNumero)}',
                      SUCO_CELULAR_OPERADORA ='${sucoCelularOperadora}',
                      SUCO_FONE_COMERCIAL_DDD ='${apenasNr(sucoFoneComercialDdd)}',
                      SUCO_FONE_COMERCIAL_NUMERO ='${ apenasNr(sucoFoneComercialNumero)}',
                      SUCO_FONE_COMERCIAL_RAMAL ='${apenasNr(sucoFoneComercialRamal)}',
                      ID_SUCURSAL ='${idSucursal}'
                WHERE ID_SUCURSAL_CONTATO = '${idSucursalContato}'  
                `
              ,[],{outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit :  true});
                res.send("sucesso").status(200).end();  

            }else{
          
            await connection.execute (              
               ` 
               INSERT INTO SUCURSAL_CONTATO(  ID_SUCURSAL_CONTATO,
                                              SUCO_NOME,
                                              SUCO_FUNCAO,
                                              SUCO_DEPARTAMENTO,
                                              SUCO_EMAIL,
                                              SUCO_URL,
                                              SUCO_CELULAR_DDD,
                                              SUCO_CELULAR_NUMERO,
                                              SUCO_CELULAR_OPERADORA,
                                              SUCO_FONE_COMERCIAL_DDD,
                                              SUCO_FONE_COMERCIAL_NUMERO,
                                              SUCO_FONE_COMERCIAL_RAMAL,
                                              ID_SUCURSAL               
                                              )
                                       VALUES(SEQ_SUCO.NEXTVAL,
                                              '${sucoNome}',
                                              '${sucoFuncao}',
                                              '${sucoDepartamento}',
                                              '${sucoEmail}',
                                              '${sucoUrl}',
                                              '${apenasNr(sucoCelularDdd)}',
                                              '${apenasNr(sucoCelularNumero)}',
                                              '${sucoCelularOperadora}',
                                              '${apenasNr(sucoFoneComercialDdd)}',
                                              '${apenasNr(sucoFoneComercialNumero)}',
                                              '${apenasNr(sucoFoneComercialRamal)}',
                                              '${idSucursal}'
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
  }); 

router.post("/listarContatoSucursal", async(req, res)=> {
    const {token,idSucursal  
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
            SELECT * FROM SUCURSAL_CONTATO SUCO
            WHERE SUCO.ID_SUCURSAL = :ID_SUCURSAL
            `,
            [ idSucursal],
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
  
router.post("/excluirContatoSucursal", async(req, res)=> {
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
            DELETE FROM SUCURSAL_CONTATO 
            WHERE  ID_SUCURSAL_CONTATO = ${idCont}
            `  
          )
                        
        }
    })  
    try {
      console.log(deleteSql);
    
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