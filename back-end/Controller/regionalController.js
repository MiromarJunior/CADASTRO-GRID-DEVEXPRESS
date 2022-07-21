const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const dbConfig = require("../ConfigDB/configDB.js");
const { apenasNr } = require("../Service/utilServiceBackEnd.js");

const app = express();
app.use(express.json());

router.post("/listarRegional", async (req, res) => {
  const { token } = req.body;

  let connection = await oracledb.getConnection(dbConfig);
  let result;
  //let selectSql = "";

  try {
    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();
      } else {
        result = await connection.execute(
          `
          select * from REGIONAL
          `,
          [],
          { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.send(result.rows).status(200).end();
      }
    });
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
});

router.post("/saveRegional", async (req, res) => {
  const { rgalAbreviatura,rgalDescricao,rgalFormaAberturaAtual,
          rgalNovaFormaAbertura,rgalFormaEncerramento,rgalRegraCalculoAtual, 
          rgalNovaRegraCalculo,rgalTipoDisputaAtual,rgalNovoTipoDisputa, 
          token, idRegional, acessoGeral  } = req.body;
  let connection = await oracledb.getConnection(dbConfig);
       
  if (acessoGeral) {
    try {
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();
        } else {
          if (idRegional > 0) {
            
            await connection.execute(
              `
            UPDATE  REGIONAL
               SET  RGAL_ABREVIATURA = '${rgalAbreviatura}',
                    RGAL_DESCRICAO = '${rgalDescricao}',
                    RGAL_FORMA_ABERTURA_ATUAL = '${rgalFormaAberturaAtual}',
                    RGAL_NOVA_FORMA_ABERTURA = '${rgalNovaFormaAbertura}',
                    RGAL_FORMA_ENCERRAMENTO = '${rgalFormaEncerramento}',
                    RGAL_REGRA_CALCULO_ATUAL = '${rgalRegraCalculoAtual}',
                    RGAL_NOVA_REGRA_CALCULO = '${rgalNovaRegraCalculo}',
                    RGAL_TIPO_DISPUTA_ATUAL = '${rgalTipoDisputaAtual}',
                    RGAL_NOVO_TIPO_DISPUTA ='${rgalNovoTipoDisputa}'
             where  ID_REGIONAL = '${idRegional}'
               `,
              [],
              { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
            );
            res.send("sucesso").status(200).end();
          } else {
            await connection.execute(
              `INSERT INTO REGIONAL(ID_REGIONAL,               RGAL_ABREVIATURA,
                                    RGAL_DESCRICAO,            RGAL_FORMA_ABERTURA_ATUAL, 
                                    RGAL_NOVA_FORMA_ABERTURA,  RGAL_FORMA_ENCERRAMENTO,   
                                    RGAL_REGRA_CALCULO_ATUAL,  RGAL_NOVA_REGRA_CALCULO,   
                                    RGAL_TIPO_DISPUTA_ATUAL,   RGAL_NOVO_TIPO_DISPUTA )
                            VALUES( SEQ_RGAL.NEXTVAL,          '${rgalAbreviatura}',
                                    '${rgalDescricao}',        '${rgalFormaAberturaAtual}',
                                    '${rgalNovaFormaAbertura}','${rgalFormaEncerramento}',
                                    '${rgalRegraCalculoAtual}','${rgalNovaRegraCalculo}',
                                    '${rgalTipoDisputaAtual}', '${rgalNovoTipoDisputa}')
              `,
              [],
              { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
            );
            res.send("sucesso").status(200).end();
          }
        }
      });
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

router.post("/excluirRegional", async (req, res) => {
  const {idRegional, token, acessoGeral
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
                  DELETE FROM REGIONAL 
                  WHERE  ID_REGIONAL = ${idRegional}
                  `
              )
          }
      })

      try {
          await connection.execute(deleteSql
              ,
              [],
              {
                  outFormat: oracledb.OUT_FORMAT_OBJECT,
                  autoCommit: true
              });

          res.send("sucesso").status(200).end();
      } catch (error) {
          console.error('Erro ao Excluir Cadastro', error);
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
module.exports = router;
