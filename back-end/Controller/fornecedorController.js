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


router.post("/cadastrarFornecedor", async(req, res)=> {
       let {  idFornecedor,                 
        fornCnpj,                     
        fornIdLegado,                
        fornNaturezaJuridica,        
        fornNomeFantasia,            
        fornRazaoSocial,             
        fornOptanteSimplesNacional,
        fornStatus,                   
        fornSituacao,                 
        fornInscricaoEstadual,       
        fornInscricaoMunicipal,      
        fornCep,                      
        fornCidade,                   
        estadoUF,         
        fornRua,                      
        fornNumero,                   
        fornComplemento,              
        fornBairro,                   
        fornGrupoEconomico,          
        fornHorarioSaida1,           
        fornHorarioSaida2,           
        fornHorarioSaida3,           
        fornMultimarcas,              
        fornTipoPeca,                
        fornFaturamentoMinimo,       
        fornLatitude,                 
        fornLongitude, 
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
          ` INSERT INTO FORNECEDOR(ID_FORNECEDOR,                  FORN_CNPJ,                     
                                  FORN_ID_LEGADO,                 FORN_NATUREZA_JURIDICA,        
                                  FORN_NOME_FANTASIA,             FORN_RAZAO_SOCIAL,             
                                  FORN_OPTANTE_SIMPLES_NACIONAL,  FORN_STATUS,                   
                                  FORN_SITUACAO,                  FORN_INSCRICAO_ESTADUAL,       
                                  FORN_INSCRICAO_MUNICIPAL,       FORN_CEP,                      
                                  FORN_CIDADE,                    ID_UNIDADE_FEDERATIVA,         
                                  FORN_RUA,                       FORN_NUMERO,                   
                                  FORN_COMPLEMENTO,               FORN_BAIRRO,                   
                                  FORN_GRUPO_ECONOMICO,           FORN_HORARIO_SAIDA1,           
                                  FORN_HORARIO_SAIDA2,            FORN_HORARIO_SAIDA3,           
                                  FORN_MULTIMARCAS,               FORN_TIPO_PECA,                
                                  FORN_FATURAMENTO_MINIMO,        FORN_LATITUDE,                 
                                  FORN_LONGITUDE)                
                                  
                          VALUES (SEQ_FORN.NEXTVAL,                :FORN_CNPJ,                     
                                  :FORN_ID_LEGADO,                 :FORN_NATUREZA_JURIDICA,        
                                  :FORN_NOME_FANTASIA,             :FORN_RAZAO_SOCIAL,             
                                  :FORN_OPTANTE_SIMPLES_NACIONAL,  :FORN_STATUS,                   
                                  :FORN_SITUACAO,                  :FORN_INSCRICAO_ESTADUAL,       
                                  :FORN_INSCRICAO_MUNICIPAL,       :FORN_CEP,                      
                                  :FORN_CIDADE,                    :ID_UNIDADE_FEDERATIVA,         
                                  :FORN_RUA,                       :FORN_NUMERO,                   
                                  :FORN_COMPLEMENTO,               :FORN_BAIRRO,                   
                                  :FORN_GRUPO_ECONOMICO,           :FORN_HORARIO_SAIDA1,           
                                  :FORN_HORARIO_SAIDA2,            :FORN_HORARIO_SAIDA3,           
                                  :FORN_MULTIMARCAS,               :FORN_TIPO_PECA,                
                                  :FORN_FATURAMENTO_MINIMO,        :FORN_LATITUDE,                 
                                  :FORN_LONGITUDE) 
          `
        )

        updateSql = (
          `        UPDATE FORNECEDOR
                      SET FORN_ID_LEGADO                = :FORN_ID_LEGADO,
                          FORN_NATUREZA_JURIDICA        = :FORN_NATUREZA_JURIDICA,        
                          FORN_NOME_FANTASIA            = :FORN_NOME_FANTASIA,          
                          FORN_RAZAO_SOCIAL             = :FORN_RAZAO_SOCIAL,         
                          FORN_OPTANTE_SIMPLES_NACIONAL = :FORN_OPTANTE_SIMPLES_NACIONAL,
                          FORN_STATUS                   = :FORN_STATUS,                 
                          FORN_SITUACAO                 = :FORN_SITUACAO,              
                          FORN_INSCRICAO_ESTADUAL       = :FORN_INSCRICAO_ESTADUAL,
                          FORN_INSCRICAO_MUNICIPAL      = :FORN_INSCRICAO_MUNICIPAL,   
                          FORN_CEP                      = :FORN_CEP,                   
                          FORN_CIDADE                   = :FORN_CIDADE,               
                          ID_UNIDADE_FEDERATIVA         = :ID_UNIDADE_FEDERATIVA       
                          FORN_RUA                      = :FORN_RUA,                
                          FORN_NUMERO                   = :FORN_NUMERO,               
                          FORN_COMPLEMENTO              = :FORN_COMPLEMENTO,           
                          FORN_BAIRRO                   = :FORN_BAIRRO,               
                          FORN_GRUPO_ECONOMICO          = :FORN_GRUPO_ECONOMICO,       
                          FORN_HORARIO_SAIDA1           = :FORN_HORARIO_SAIDA1,          
                          FORN_HORARIO_SAIDA2           = :FORN_HORARIO_SAIDA2,         
                          FORN_HORARIO_SAIDA3           = :FORN_HORARIO_SAIDA3,        
                          FORN_MULTIMARCAS              = :FORN_MULTIMARCAS,         
                          FORN_TIPO_PECA                = :FORN_TIPO_PECA,              
                          FORN_FATURAMENTO_MINIMO       = :FORN_FATURAMENTO_MINIMO,    
                          FORN_LATITUDE                 = :FORN_LATITUDE,               
                          FORN_LONGITUDE                = :FORN_LONGITUDE               
                    WHERE ID_FORNECEDOR                 = :ID_FORNECEDOR
        `

        )

        selectSql =(
          `SELECT ID_FORNECEDOR 
             FROM FORNECEDOR  
            WHERE FORN_CNPJ = :FORN_CNPJ         
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

    if(idFornecedor > 0){   
      await connection.execute (     
       updateSql
        ,
        [ fornIdLegado,                fornNaturezaJuridica,        
          fornNomeFantasia,            fornRazaoSocial,             
          fornOptanteSimplesNacional,  fornStatus,                   
          fornSituacao,                fornInscricaoEstadual,       
          fornInscricaoMunicipal,      fornCep,                      
          fornCidade,                  idEstado,         
          fornRua,                     fornNumero,                   
          fornComplemento,             fornBairro,                   
          fornGrupoEconomico,          fornHorarioSaida1,           
          fornHorarioSaida2,           fornHorarioSaida3,           
          fornMultimarcas,             fornTipoPeca,                
          fornFaturamentoMinimo,       fornLatitude,                 
          fornLongitude,               idFornecedor
        ],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });
      
    }else{
      
      await connection.execute (     
        insertSql
        ,
        [ fornCnpj,               fornIdLegado,                
          fornNaturezaJuridica,  fornNomeFantasia,            
          fornRazaoSocial,       fornOptanteSimplesNacional,
          fornStatus,             fornSituacao,                 
          fornInscricaoEstadual, fornInscricaoMunicipal,      
          fornCep,                fornCidade,                   
          idEstado,                  fornRua,                      
          fornNumero,             fornComplemento,              
          fornBairro,             fornGrupoEconomico,          
          fornHorarioSaida1,     fornHorarioSaida2,           
          fornHorarioSaida3,     fornMultimarcas,              
          fornTipoPeca,          fornFaturamentoMinimo,       
          fornLatitude,           fornLongitude  ],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });

    }

  let result =  await connection.execute( selectSql
    ,
     [fornCnpj ],
     { outFormat  :  oracledb.OUT_FORMAT_OBJECT
      
   });   
   res.send(result.rows).status(200).end(); 
          
  } catch (error) {
    
      console.error("Erro ao tentar cadastrar Fornecedor!",error);
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

router.post("/listarFornecedor", async(req, res)=> {
    const {token,idFornecedor} =req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;
    let selectSql = "";
    if(idFornecedor > 0){
     selectSql =  `AND ID_FORNECEDOR = ${idFornecedor}`
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
            FROM FORNECEDOR FORN, 
                 UNIDADE_FEDERATIVA UNFE
           WHERE FORN.ID_UNIDADE_FEDERATIVA = UNFE.ID_UNIDADE_FEDERATIVA(+) 
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

router.post("/excluirFornecedor", async(req, res)=> {
    const {token,idFornecedor} =req.body;
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
          DELETE FROM FORNECEDOR  WHERE  ID_FORNECEDOR = ${idFornecedor}
          `
        )

        deleteSql1 = (
          ` 
          DELETE FROM FORNECEDOR_CONTATO WHERE ID_FORNECEDOR =  ${idFornecedor}
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

router.post("/cadastrarContatoFornecedor", async(req, res)=> {
    const {token,idFornecedor,contatos   } =req.body; 
      let connection = await oracledb.getConnection(dbConfig);
      let v_frco_nome                  = contatos.FRCO_NOME,                  
          v_frco_funcao                = contatos.FRCO_FUNCAO,                
          v_frco_departamento          = contatos.FRCO_DEPARTAMENTO,          
          v_frco_email                 = contatos.FRCO_EMAIL,                 
          v_frco_url                   = contatos.FRCO_URL,                   
          v_frco_celular_ddd           = contatos.FRCO_CELULAR_DDD,           
          v_frco_celular_numero        = contatos.FRCO_CELULAR_NUMERO,        
          v_frco_celular_operadora     = contatos.FRCO_CELULAR_OPERADORA,     
          v_frco_fone_comercial_ddd    = contatos.FRCO_FONE_COMERCIAL_DDD,    
          v_frco_fone_comercial_numero = contatos.FRCO_FONE_COMERCIAL_NUMERO, 
          v_frco_fone_comercial_ramal  = contatos.FRCO_FONE_COMERCIAL_RAMAL,  
          idFornecedor_contato      = contatos.ID_FORNECEDOR_CONTATO;

    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{              

            if(idFornecedor_contato){
              await connection.execute(                `
              UPDATE  FORNECEDOR_CONTATO
              SET  FRCO_NOME = '${v_frco_nome}',
                   FRCO_FUNCAO = '${v_frco_funcao}',
                   FRCO_DEPARTAMENTO = '${v_frco_departamento}',
                   FRCO_EMAIL ='${v_frco_email}',
                   FRCO_URL='${v_frco_url}',
                   FRCO_CELULAR_DDD ='${apenasNr(v_frco_celular_ddd)}',
                   FRCO_CELULAR_NUMERO ='${apenasNr(v_frco_celular_numero)}',
                   FRCO_CELULAR_OPERADORA ='${v_frco_celular_operadora}',
                   FRCO_FONE_COMERCIAL_DDD ='${apenasNr(v_frco_fone_comercial_ddd)}',
                   FRCO_FONE_COMERCIAL_NUMERO ='${ apenasNr(v_frco_fone_comercial_numero)}',
                   FRCO_FONE_COMERCIAL_RAMAL ='${apenasNr(v_frco_fone_comercial_ramal)}',
                   ID_FORNECEDOR ='${idFornecedor}'
             WHERE ID_FORNECEDOR_CONTATO = '${idFornecedor_contato}'              
                `

              ,[],{outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit :  true});
                res.send("sucesso").status(200).end();  

            }else{
          
            await connection.execute (              
               ` 
               INSERT INTO FORNECEDOR_CONTATO(
                ID_FORNECEDOR_CONTATO,      
                FRCO_NOME,                  
                FRCO_FUNCAO,                
                FRCO_DEPARTAMENTO,         
                FRCO_EMAIL,                 
                FRCO_URL,                   
                FRCO_CELULAR_DDD,           
                FRCO_CELULAR_NUMERO,        
                FRCO_CELULAR_OPERADORA,     
                FRCO_FONE_COMERCIAL_DDD,    
                FRCO_FONE_COMERCIAL_NUMERO, 
                FRCO_FONE_COMERCIAL_RAMAL,  
                ID_FORNECEDOR  
                            )
              VALUES(
                SEQ_FRCO.NEXTVAL,
                '${v_frco_nome}',
                '${v_frco_funcao}',
                '${v_frco_departamento}',
                '${v_frco_email}',
                '${v_frco_url}',
                '${apenasNr(v_frco_celular_ddd)}',
                '${apenasNr(v_frco_celular_numero)}',
                '${v_frco_celular_operadora}',
                '${apenasNr(v_frco_fone_comercial_ddd)}',
                '${apenasNr(v_frco_fone_comercial_numero)}',
                '${apenasNr(v_frco_fone_comercial_ramal)}',
                '${idFornecedor}'
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

router.post("/listarContatoFornecedor", async(req, res)=> {
    const {token,idFornecedor  
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
            SELECT * FROM FORNECEDOR_CONTATO FRCO
            WHERE FRCO.ID_FORNECEDOR = :ID_FORNECEDOR
            `,
            [ idFornecedor],
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
  
router.post("/excluirContatoFornecedor", async(req, res)=> {
    const {token,  idFornecedor_contato
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
            DELETE FROM FORNECEDOR_CONTATO 
            WHERE  ID_FORNECEDOR_CONTATO = ${idFornecedor_contato}
|           `  
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