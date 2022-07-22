const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dbConfig = require("../ConfigDB/configDB.js");
const { apenasNr, formataVirgPont, formataPercLeilao } = require("../Service/utilServiceBackEnd.js");


const app = express();
app.use(express.json());
// let connection = await oracledb.getConnection(dbConfig);
//await connection.execute(`alter session set nls_date_format = 'DD/MM/YYYY hh24:mi:ss'`); 


router.post("/cadastrarParametroLeilao", async (req, res) => {
  let {
    token, pontuacaoInicial, horasL, horasExtend,
    horaIniL, horaFimL, tempoAbertAft,
    qtdHorasValSef, horarioAtendIni, horarioAtendFim, feriado, qtdVencedores, criticaPed, limiteApr,
    percLimite, limiteCot, qtdHorasBO, prazoBO, horasTotalCot,
    horasTotalLei, tempoRecalculo,
    percAltLeilao, encerraAnt, tempoAlt, idPar, idSeg,
    acessoGeral
  } = req.body;
  let insertSql;
  let updateSql;

  let connection = await oracledb.getConnection(dbConfig);
  if (acessoGeral) {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

      } else {
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
   PALE_HORARIO_ATEND_FALE_CO_INI,
   PALE_HORARIO_ATEND_FALE_CO_FIM,
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
   PALE_ONLINE_TEMPO_ALT,
   ID_SEGURADORA
   )
VALUES
  (SEQ_PALE.NEXTVAL,'${pontuacaoInicial}','${horasL}', '${horasExtend}', '${horaIniL}', '${horaFimL}','${tempoAbertAft}',
  '${qtdHorasValSef}', '${horarioAtendIni}','${horarioAtendFim}', '${feriado}', '${qtdVencedores}', '${criticaPed}', '${limiteApr}','${percLimite}', '${limiteCot}',
  '${qtdHorasBO}', '${prazoBO}', '${horasTotalCot}', '${horasTotalLei}', '${tempoRecalculo}', '${encerraAnt}', '${percAltLeilao}',
  '${tempoAlt}','${idSeg}' )          
            
          `
        )

        updateSql = (
          ` UPDATE PARAMETROS_LEILAO
          SET PALE_RANKING_PONTUACAO_INICIAL = '${pontuacaoInicial}',
          PALE_HORAS = '${horasL}',
          PALE_HORAS_EXTENDIDAS = '${horasExtend}',
          PALE_HORARIO_INICIO = '${horaIniL}',
          PALE_HORARIO_FIM = '${horaFimL}',
          PALE_TEMPO_ABERTURA_AFTER = '${tempoAbertAft}',
          PALE_QTDE_HORAS_VALID_SEFAZ = '${qtdHorasValSef}', 
          PALE_HORARIO_ATEND_FALE_CO_INI = '${horarioAtendIni}',
          PALE_HORARIO_ATEND_FALE_CO_FIM = '${horarioAtendFim}',
          PALE_FACULTATIVO_FERIADO = '${feriado}',
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
          PALE_ONLINE_TEMPO_ALT = '${tempoAlt}',
          ID_SEGURADORA = '${idSeg}' 
          WHERE ID_PARAMETROS_LEILAO = '${idPar}'
        `
        )

      }
    });

    try {


      if (idPar > 0) {
        await connection.execute(
          updateSql
          , [],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true
          });
        res.send("sucessoU").status(200).end();

      } else {

        await connection.execute(
          insertSql
          , [],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true
          });
        res.send("sucesso").status(200).end();
      }
    } catch (error) {

      console.error("erro ao cadastrar parametro de Leilão", error);
      res.send("erroSalvar").status(500);

    } finally {
      if (connection) {
        try {
          await connection.close();

        } catch (error) {
          console.error(error);
        }
      }
    }

  } else {
    res.send("semAcesso").status(200).end();
  }


});

router.post("/listarParametroLeilaoSeg", async (req, res) => {
  const { token, idPar,
  } = req.body;

  let connection = await oracledb.getConnection(dbConfig);
  let result;
  let selectSql = "";
  if (idPar > 0) {
    selectSql = `AND ID_PARAMETROS_LEILAO = ${idPar}`

  }



  try {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

      } else {
        result = await connection.execute(
          ` 
          SELECT PL.ID_PARAMETROS_LEILAO,
          PL.PALE_RANKING_PONTUACAO_INICIAL,         
          PL.PALE_TEMPO_ABERTURA_AFTER,
          PL.PALE_QTDE_HORAS_VALID_SEFAZ,
          PL.PALE_FACULTATIVO_FERIADO,
          PL.PALE_QTDE_VENCEDORES_GENUINOS,
          PL.PALE_PORC_AJ_PRC_CRIT_PEDIDO,
          PL.PALE_PORC_AJ_PRC_LIMITE_APROV,
          PL.PALE_PORC_AJ_PRC_PERC_LIMITE,
          PL.PALE_PORC_AJ_PRC_LIMITE_COTA,
          PL.PALE_PARAM_BO_QTDE_HORAS,
          PL.PALE_PARAM_BO_QTDE_DIAS,        
          PL.PALE_ONLINE_TEMPO_RECALCULO,
          PL.PALE_ONLINE_TEMPO_ENCER_ANTEC,
          PL.PALE_ONLINE_PERC_ALT_LEILAO,
          PL.PALE_ONLINE_TEMPO_ALT,       
          PL.ID_SEGURADORA,
          TO_CHAR(PL.PALE_HORAS,'00,00') AS HORAS,
          TO_CHAR(PL.PALE_HORAS_EXTENDIDAS,'00,00') AS HORAS_EXT,
          TO_CHAR(PL.PALE_HORARIO_INICIO,'00,00') AS HORA_INI,
          TO_CHAR(PL.PALE_HORARIO_FIM,'00,00') AS HORA_FIM,          
          TO_CHAR(PL.PALE_ONLINE_HORAS_COTACAO,'00,00') AS HORAS_COT,
          TO_CHAR(PL.PALE_ONLINE_HORAS_LEILAO,'00,00') AS HORAS_LEIL,
          TO_CHAR(PL.PALE_HORARIO_ATEND_FALE_CO_INI,'00,00') AS HORAS_FAL_CON_IN,
          TO_CHAR(PL.PALE_HORARIO_ATEND_FALE_CO_FIM,'00,00') AS HORAS_FAL_CON_FIM,
          SG.SGRA_RAZAO_SOCIAL,
          SG.SGRA_CNPJ
          FROM PARAMETROS_LEILAO PL, SEGURADORA SG
          WHERE PL.ID_SEGURADORA = SG.ID_SEGURADORA
          ${selectSql}
            
          `,
          [],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,

          }
        );

        res.send(result.rows).status(200).end();
      }
    })

  } catch (error) {
    console.error("erro ao listar parametros", error);
    res.send("erroSalvar").status(500);

  } finally {
    if (connection) {
      try {
        await connection.close();

      } catch (error) {
        console.error(error);
      }
    }
  }




});

router.post("/excluirParametroLeilao", async (req, res) => {
  const { token, idPar, acessoGeral
  } = req.body;


  let connection = await oracledb.getConnection(dbConfig);


  let deleteSql = "";

  if (acessoGeral) {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

      } else {

        deleteSql = (
          ` 
          DELETE FROM PARAMETROS_LEILAO 
          WHERE ID_PARAMETROS_LEILAO = ${idPar}           
          `
        )
      }
    })
    try {

      let result = await connection.execute(
        deleteSql
        , [],
        {
          outFormat: oracledb.OUT_FORMAT_OBJECT,
          autoCommit: true
        });
      result.rowsAffected > 0 ? res.send("sucesso").status(200).end() : res.send("erroSalvar").status(200).end();

    } catch (error) {
      console.error(error);
      res.send("erro de conexao").status(500);

    } finally {
      if (connection) {
        try {
          await connection.close();

        } catch (error) {
          console.error(error);
        }
      }
    }

  } else {
    res.send("semAcesso").status(200).end();
  }


});

router.post("/listarSeguradorParamLeilao", async (req, res) => {
  const { token, idPar,
  } = req.body;

  let connection = await oracledb.getConnection(dbConfig);
  let result;
  let selectSql = "";
  if (idPar) {

    selectSql =
      `
    SELECT SG.* FROM SEGURADORA SG
    WHERE SG.ID_SEGURADORA = 
    (SELECT PL.ID_SEGURADORA FROM PARAMETROS_LEILAO PL
    WHERE PL.ID_PARAMETROS_LEILAO =${idPar} )
    UNION

    `
      ;
  }

  try {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

      } else {
        result = await connection.execute(
          ` ${selectSql}
          SELECT * FROM SEGURADORA SG
          WHERE SG.ID_SEGURADORA 
          NOT IN (SELECT PL.ID_SEGURADORA FROM PARAMETROS_LEILAO PL)
            
          `,
          [],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,

          }
        );

        res.send(result.rows).status(200).end();
      }
    })

  } catch (error) {
    console.error("erro ao listar params seguradora", error);
    res.send("erroSalvar").status(500);

  } finally {
    if (connection) {
      try {
        await connection.close();

      } catch (error) {
        console.error(error);
      }
    }
  }




});

router.post("/cadastrarHoraLeilao", async (req, res) => {
  let {
    token, acessoGeral, periodoPadrao, periodoAdicional, acrescimo, estado, idH
  } = req.body;
  let insertPeriodo;
  let insertAcrescimo;

  let connection = await oracledb.getConnection(dbConfig);
  if (acessoGeral) {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

      } else {
        insertPeriodo = (

          ` INSERT INTO HORARIO_LEILAO(ID_HORARIO_LEILAO,
            HOLE_HORARIO_PADRAO,
            HOLE_PERIODO_ADICIONAL) 
            VALUES(SEQ_HOLE.nextval, '${periodoPadrao}', '${periodoAdicional}')
                
            
          `
        )

        insertAcrescimo = (

          ` INSERT INTO HORARIO_LEILAO_UF(ID_HORARIO_LEILAO_UF,
            HLUF_PERIODO_ACRESCIMO,
            ID_UNIDADE_FEDERATIVA)
            VALUES(SEQ_HLUF.nextval, '${acrescimo}', '${estado}') 
        `
        )

      }
    });

    try {


      if (idH > 0) {
        await connection.execute(
          updateSql
          , [],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true
          });
        res.send("sucessoU").status(200).end();

      } else {

        await connection.execute(
          insertPeriodo
          , [],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true
          });

        await connection.execute(
          insertAcrescimo
          , [],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,
            autoCommit: true
          });
        res.send("sucesso").status(200).end();
      }
    } catch (error) {

      console.error("erro ao cadastrar horas do Leilão", error);
      res.send("erroSalvar").status(500);

    } finally {
      if (connection) {
        try {
          await connection.close();

        } catch (error) {
          console.error(error);
        }
      }
    }

  } else {
    res.send("semAcesso").status(200).end();
  }


});

router.post("/listarAcrescimoHoraLeilao", async (req, res) => {
  const { token
  } = req.body;

  let connection = await oracledb.getConnection(dbConfig);
  let result;
  let selectSql = "";
  
  try {

    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

      } else {
        result = await connection.execute(
          ` 
          SELECT HU.ID_HORARIO_LEILAO_UF,
          TO_CHAR(HU.HLUF_PERIODO_ACRESCIMO,'00,00') AS ACRESCIMO,  
          HU.HLUF_PERIODO_ACRESCIMO,
          HU.ID_UNIDADE_FEDERATIVA,UF.UNFE_SIGLA,
          UF.UNFE_DESCRICAO,
          UF.ID_REGIAO FROM HORARIO_LEILAO_UF HU , UNIDADE_FEDERATIVA UF 
          WHERE HU.ID_UNIDADE_FEDERATIVA = UF.ID_UNIDADE_FEDERATIVA

          
          
            
          `,
          [],
          {
            outFormat: oracledb.OUT_FORMAT_OBJECT,

          }
        );

        res.send(result.rows).status(200).end();
      }
    })

  } catch (error) {
    console.error("erro ao listar acrescimos por estado", error);
    res.send("erroSalvar").status(500);

  } finally {
    if (connection) {
      try {
        await connection.close();

      } catch (error) {
        console.error(error);
      }
    }
  }




});





module.exports = router;