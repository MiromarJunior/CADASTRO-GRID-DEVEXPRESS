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


router.post("/cadastrarReguladora", async(req, res)=> {
       let {idReguladora,                
            rgraCnpj,                    
            rgraIdLegado,               
            rgraNaturezaJuridica,       
            rgraNomeFantasia,           
            rgraRazaoSocial,            
            rgraOptanteSimplesNacional,
            rgraStatus,                  
            rgraTipoReguladora,         
            rgraSigla,                   
            regionalId,                  
            rgraInscricaoEstadual,      
            rgraInscricaoMunicipal,     
            rgraCep,                     
            rgraCidade,                  
            estadoUF,        
            rgraRua,                     
            rgraNumero,                  
            rgraComplemento,             
            rgraBairro,  
            token} =req.body;       

let insertSql;
let selectSql;
let updateSql;
let idEstado;
let idRegional;

    let connection = await oracledb.getConnection(dbConfig);  

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

      } else{  

        insertSql = (
          ` INSERT INTO REGULADORA( ID_REGULADORA,                RGRA_CNPJ,                    
                                   RGRA_ID_LEGADO,                RGRA_NATUREZA_JURIDICA,       
                                   RGRA_NOME_FANTASIA,            RGRA_RAZAO_SOCIAL,            
                                   RGRA_OPTANTE_SIMPLES_NACIONAL, RGRA_STATUS,                  
                                   RGRA_TIPO_REGULADORA,          RGRA_SIGLA,                   
                                   ID_REGIONAL,                   RGRA_INSCRICAO_ESTADUAL,      
                                   RGRA_INSCRICAO_MUNICIPAL,      RGRA_CEP,                     
                                   RGRA_CIDADE,                   ID_UNIDADE_FEDERATIVA,        
                                   RGRA_RUA,                      RGRA_NUMERO,                  
                                   RGRA_COMPLEMENTO,              RGRA_BAIRRO )                

                           VALUES (SEQ_RGRA.NEXTVAL,               :RGRA_CNPJ,              
                                   :RGRA_ID_LEGADO,                :RGRA_NATUREZA_JURIDICA, 
                                   :RGRA_NOME_FANTASIA,            :RGRA_RAZAO_SOCIAL,      
                                   :RGRA_OPTANTE_SIMPLES_NACIONAL, :RGRA_STATUS,                  
                                   :RGRA_TIPO_REGULADORA,          :RGRA_SIGLA,                   
                                   :ID_REGIONAL,                   :RGRA_INSCRICAO_ESTADUAL,      
                                   :RGRA_INSCRICAO_MUNICIPAL,      :RGRA_CEP,                     
                                   :RGRA_CIDADE,                   :ID_UNIDADE_FEDERATIVA,        
                                   :RGRA_RUA,                      :RGRA_NUMERO,                  
                                   :RGRA_COMPLEMENTO,              :RGRA_BAIRRO )   
          `
        )

        updateSql = (
          `    UPDATE REGULADORA
                  SET RGRA_CNPJ                     = :RGRA_CNPJ,                   
                      RGRA_ID_LEGADO                = :RGRA_ID_LEGADO,              
                      RGRA_NATUREZA_JURIDICA        = :RGRA_NATUREZA_JURIDICA,      
                      RGRA_NOME_FANTASIA            = :RGRA_NOME_FANTASIA,         
                      RGRA_RAZAO_SOCIAL             = :RGRA_RAZAO_SOCIAL,           
                      RGRA_OPTANTE_SIMPLES_NACIONAL = :RGRA_OPTANTE_SIMPLES_NACIONAL,
                      RGRA_STATUS                   = :RGRA_STATUS,                 
                      RGRA_TIPO_REGULADORA          = :RGRA_TIPO_REGULADORA,         
                      RGRA_SIGLA                    = :RGRA_SIGLA,                
                      ID_REGIONAL                   = :ID_REGIONAL,                
                      RGRA_INSCRICAO_ESTADUAL       = :RGRA_INSCRICAO_ESTADUAL, 
                      RGRA_INSCRICAO_MUNICIPAL      = :RGRA_INSCRICAO_MUNICIPAL,    
                      RGRA_CEP                      = :RGRA_CEP,                 
                      RGRA_CIDADE                   = :RGRA_CIDADE,       
                      ID_UNIDADE_FEDERATIVA         = :ID_UNIDADE_FEDERATIVA,    
                      RGRA_RUA                      = :RGRA_RUA,
                      RGRA_NUMERO                   = :RGRA_NUMERO,            
                      RGRA_COMPLEMENTO              = :RGRA_COMPLEMENTO,            
                      RGRA_BAIRRO                   = :RGRA_BAIRRO           
                WHERE ID_REGULADORA                 = :ID_REGULADORA
        `

        )

        selectSql =(
          `SELECT ID_REGULADORA 
             FROM REGULADORA  
            WHERE RGRA_CNPJ = :RGRA_CNPJ         
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
     c = (estado.rows).toString();  

     let regional = await connection.execute (  
      `
      SELECT ID_REGIONAL
        FROM REGIONAL
       WHERE RGAL_ABREVIATURA = :RGAL_ABRE
      `
      ,
      [regionalId],
      { outFormat  :  oracledb.OUT_FORMAT_ARRAY,
        autoCommit :  true
    }); 
     idRegional = (regional.rows).toString();       

    if(idReguladora > 0){   
      await connection.execute (     
       updateSql
        ,
        [ rgraCnpj,                 rgraIdLegado,              
          rgraNaturezaJuridica,     rgraNomeFantasia,         
          rgraRazaoSocial,          rgraOptanteSimplesNacional,
          rgraStatus,               rgraTipoReguladora,         
          rgraSigla,                idRegional,                
          rgraInscricaoEstadual,    rgraInscricaoMunicipal,    
          rgraCep,                  rgraCidade,       
          idEstado,                 rgraRua,
          rgraNumero,               rgraComplemento,            
          rgraBairro,               idReguladora 
        ],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });
      
    }else{
      
      await connection.execute (     
        insertSql
        ,
        [ rgraCnpj,                 rgraIdLegado,              
          rgraNaturezaJuridica,     rgraNomeFantasia,         
          rgraRazaoSocial,          rgraOptanteSimplesNacional,
          rgraStatus,               rgraTipoReguladora,         
          rgraSigla,                idRegional,                
          rgraInscricaoEstadual,    rgraInscricaoMunicipal,    
          rgraCep,                  rgraCidade,       
          idEstado,                 rgraRua,
          rgraNumero,               rgraComplemento,            
          rgraBairro                               ],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });

    }

  let result =  await connection.execute( selectSql
    ,
     [rgraCnpj ],
     { outFormat  :  oracledb.OUT_FORMAT_OBJECT
      
   });   
   res.send(result.rows).status(200).end(); 
          
  } catch (error) {
    
      console.error("Erro ao tentar cadastrar Reguladora!",error);
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

router.post("/listarReguladora", async(req, res)=> {
    const {token,idReguladora} =req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;
    let selectSql = "";
    if(idReguladora > 0){
     selectSql =  `AND ID_REGULADORA = ${idReguladora}`
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
            FROM REGULADORA         RGRA, 
                 UNIDADE_FEDERATIVA UNFE,
                 REGIONAL           RGAL
           WHERE RGRA.ID_UNIDADE_FEDERATIVA = UNFE.ID_UNIDADE_FEDERATIVA(+) 
             AND RGRA.ID_REGIONAL           = RGAL.ID_REGIONAL(+)
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

router.post("/excluirReguladora", async(req, res)=> {
    const {token,idReguladora} =req.body;
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
          DELETE FROM REGULADORA  WHERE  ID_REGULADORA = ${idReguladora}
          `
        )

        deleteSql1 = (
          ` 
          DELETE FROM REGULADORA_CONTATO WHERE ID_REGULADORA =  ${idReguladora}
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

router.post("/cadastrarContatoReguladora", async(req, res)=> {
    const {token,idReguladora,contatos   } =req.body; 
      let connection = await oracledb.getConnection(dbConfig);
      let rgcoNome                = contatos.RGCO_NOME,                  
          rgcoFuncao              = contatos.RGCO_FUNCAO,                
          rgcoDepartamento        = contatos.RGCO_DEPARTAMENTO,          
          rgcoEmail               = contatos.RGCO_EMAIL,                 
          rgcoUrl                 = contatos.RGCO_URL,                   
          rgcoCelularDdd          = contatos.RGCO_CELULAR_DDD,           
          rgcoCelularNumero       = contatos.RGCO_CELULAR_NUMERO,        
          rgcoCelularOperadora    = contatos.RGCO_CELULAR_OPERADORA,     
          rgcoFoneComercialDdd    = contatos.RGCO_FONE_COMERCIAL_DDD,    
          rgcoFoneComercialNumero = contatos.RGCO_FONE_COMERCIAL_NUMERO, 
          rgcoFoneComercialRamal  = contatos.RGCO_FONE_COMERCIAL_RAMAL,  
          idReguladoraContato     = contatos.ID_REGULADORA_CONTATO;
                      
    try {
  
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
  
        } else{              

            if(idReguladoraContato){
              await connection.execute(                `
              UPDATE  FORNECEDOR_CONTATO
                 SET  RGCO_NOME = '${rgcoNome}',
                      RGCO_FUNCAO = '${rgcoFuncao}',
                      RGCO_DEPARTAMENTO = '${rgcoDepartamento}',
                      RGCO_EMAIL ='${rgcoEmail}',
                      RGCO_URL='${rgcoUrl}',
                      RGCO_CELULAR_DDD ='${apenasNr(rgcoCelularDdd)}',
                      RGCO_CELULAR_NUMERO ='${apenasNr(rgcoCelularNumero)}',
                      RGCO_CELULAR_OPERADORA ='${rgcoCelularOperadora}',
                      RGCO_FONE_COMERCIAL_DDD ='${apenasNr(rgcoFoneComercialDdd)}',
                      RGCO_FONE_COMERCIAL_NUMERO ='${ apenasNr(rgcoFoneComercialNumero)}',
                      RGCO_FONE_COMERCIAL_RAMAL ='${apenasNr(rgcoFoneComercialRamal)}',
                      ID_REGULADORA ='${idReguladora}'
                WHERE ID_REGULADORA_CONTATO = '${idReguladoraContato}'       
                `
              ,[],{outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit :  true});
                res.send("sucesso").status(200).end();  

            }else{
          
            await connection.execute (              
               ` 
               INSERT INTO ID_REGULADORA_CONTATO(
                ID_REGULADORA_CONTATO,      
                RGCO_NOME,                  
                RGCO_FUNCAO,                
                RGCO_DEPARTAMENTO,         
                RGCO_EMAIL,                 
                RGCO_URL,                   
                RGCO_CELULAR_DDD,           
                RGCO_CELULAR_NUMERO,        
                RGCO_CELULAR_OPERADORA,     
                RGCO_FONE_COMERCIAL_DDD,    
                RGCO_FONE_COMERCIAL_NUMERO, 
                RGCO_FONE_COMERCIAL_RAMAL,  
                ID_REGULADORA  
                            )
              VALUES(
                SEQ_RGCO.NEXTVAL,
                '${rgcoNome}',
                '${rgcoFuncao}',
                '${rgcoDepartamento}',
                '${rgcoEmail}',
                '${rgcoUrl}',
                '${apenasNr(rgcoCelularDdd)}',
                '${apenasNr(rgcoCelularNumero)}',
                '${rgcoCelularOperadora}',
                '${apenasNr(rgcoFoneComercialDdd)}',
                '${apenasNr(rgcoFoneComercialNumero)}',
                '${apenasNr(rgcoFoneComercialRamal)}',
                '${idReguladora}'
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

router.post("/listarContatoReguladora", async(req, res)=> {
    const {token,idReguladora  
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
            SELECT * FROM REGULADORA_CONTATO RGCO
            WHERE RGCO.ID_REGULADORA = :ID_REGULADORA
            `,
            [ idReguladora],
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
  
router.post("/excluirContatoReguladora", async(req, res)=> {
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
            DELETE FROM REGULADORA_CONTATO 
            WHERE  ID_REGULADORA_CONTATO = ${idCont}  
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