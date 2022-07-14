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


router.post("/cadastrarParametroLeilao", async(req, res)=> {
  let {
    token,pontuacaoInicial,horasL  , horasExtend  , 
    horaIniL  , horaFimL  , tempoAbertAft,
    qtdHorasValSef, horarioAtend  , feriado, qtdVencedores, criticaPed, limiteApr,
    percLimite, limiteCot, qtdHorasBO, prazoBO, horasTotalCot  , 
    horasTotalLei , tempoRecalculo,
    percAltLeilao, encerraAnt, tempoAlt,idPar, 
    acessoGeral  
} =req.body;
let insertSql;
let updateSql;

    let connection = await oracledb.getConnection(dbConfig);  
    if(acessoGeral){    

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

      } else{  
        insertSql = (
          ` 
          INSERT INTO PARAMETROS_LEILAO
  (ID_PARAMETROS_LEILAO,
   PALE_RANKING_PONTUACAO_INICIAL,
   PALE_HORAS,
   PALE_HORAS_EXTENDIDAS,
   PALE_HORARIO_INICIO,
   PALE_HORARIO_FIM,
   PALE_TEMPO_ABERTURA_AFTER,
   PALE_QTDE_HORAS_VALID_SEFAZ,
   PALE_HORARIO_ATEND_FALE_CONOSC,
   PALE_FACULTATIVO_FERIADO,
   PALE_QTDE_VENCEDORES_GENUINOS,
   PALE_PORC_AJ_PRC_CRIT_PEDIDO,
   PALE_PORC_AJ_PRC_LIMITE_APROV,
   PALE_PORC_AJ_PRC_PERC_LIMITE,
   PALE_PORC_AJ_PRC_LIMITE_COTA,
   PALE_PARAM_BO_QTDE_HORAS,
   PALE_PARAM_BO_QTDE_DIAS,
   PALE_ONLINE_HORAS_COTACAO,
   PALE_ONLINE_HORAS_LEILAO,
   PALE_ONLINE_TEMPO_RECALCULO,
   PALE_ONLINE_TEMPO_ENCER_ANTEC,
   PALE_ONLINE_PERC_ALT_LEILAO,
   PALE_ONLINE_TEMPO_ALT)
VALUES
  (SEQ_PALE.NEXTVAL,'${pontuacaoInicial}','${horasL}', TO_CHAR('${horasExtend}', '0000'), '${horaIniL}', '${horaFimL}','${tempoAbertAft}',
  '${qtdHorasValSef}', '${horarioAtend}', '${feriado}', '${qtdVencedores}', '${criticaPed}', '${limiteApr}','${percLimite}', '${limiteCot}',
  '${qtdHorasBO}', '${prazoBO}', '${horasTotalCot}', '${horasTotalLei}', '${tempoRecalculo}', '${encerraAnt}', '${percAltLeilao}',
  '${tempoAlt}' )          
            
          `
        )

        updateSql = (
          ` UPDATE PARAMETROS_LEILAO
          SET PALE_RANKING_PONTUACAO_INICIAL = '${pontuacaoInicial}',
          PALE_HORAS = '${horasL}',
          PALE_HORAS_EXTENDIDAS = '${horasExtend}',
          PALE_HORARIO_INICIO = ${horaIniL}',
          PALE_HORARIO_FIM = '${horaFimL}',
          PALE_TEMPO_ABERTURA_AFTER = '${tempoAbertAft}',
          PALE_QTDE_HORAS_VALID_SEFAZ = '${qtdHorasValSef}', 
          PALE_HORARIO_ATEND_FALE_CONOSC = '${horarioAtend}',
          PALE_FACULTATIVO_FERIADO '${feriado}',
          PALE_QTDE_VENCEDORES_GENUINOS = '${qtdVencedores}', 
          PALE_PORC_AJ_PRC_CRIT_PEDIDO = '${criticaPed}', 
          PALE_PORC_AJ_PRC_LIMITE_APROV = '${limiteApr}',
          PALE_PORC_AJ_PRC_PERC_LIMITE = '${percLimite}',
          PALE_PORC_AJ_PRC_LIMITE_COTA = '${limiteCot}',
          PALE_PARAM_BO_QTDE_HORAS ='${qtdHorasBO}',
          PALE_PARAM_BO_QTDE_DIAS = '${prazoBO}',
          PALE_ONLINE_HORAS_COTACAO ='${horasTotalCot}',
          PALE_ONLINE_HORAS_LEILAO = '${horasTotalLei}',
          PALE_ONLINE_TEMPO_RECALCULO = '${tempoRecalculo}',
          PALE_ONLINE_TEMPO_ENCER_ANTEC = '${encerraAnt}',
          PALE_ONLINE_PERC_ALT_LEILAO = '${percAltLeilao}',
          PALE_ONLINE_TEMPO_ALT = '${tempoAlt}' 
          WHERE ID_PARAMETROS_LEILAO = ${idPar}
        `
        )                         
                   
      }
  });  

  try {  
   

    if(idPar > 0){   
      await connection.execute (     
       updateSql
        ,[],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });
      res.send("sucessoU").status(200).end(); 
      
    }else{
      
      await connection.execute (     
        insertSql
        ,[],
        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
          autoCommit :  true
      });
      res.send("sucesso").status(200).end(); 
    }          
  } catch (error) {
    
      console.error("erro ao cadastrar parametro de Leilão",error);
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

router.post("/a", async(req, res)=> {
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

router.post("/a", async(req, res)=> {
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

router.post("/a", async(req, res)=> {
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

router.post("/a", async(req, res)=> {
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
  
router.post("/a", async(req, res)=> {
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