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


router.post("/listarMarcaVeiculo", async(req, res)=> {
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
          select * from MARCA_VEICULO
      
            
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
  const {token,idSeg, acessoGeral, acessoDEL  
} =req.body;


    let connection = await oracledb.getConnection(dbConfig);


let deleteSql = "";
let deleteSql1 = "";

if(acessoGeral || acessoDEL){

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
  
 

 

module.exports  = router;