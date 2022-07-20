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

router.post("/listarTipoPeca", async (req, res) => {
  const { token } = req.body;

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
          select * from TIPO_PECA

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

router.post("/saveTipoPeca", async (req, res) => {
  const { lista, token, idSeg, acessoGeral } = req.body;
  let connection = await oracledb.getConnection(dbConfig);

  let nomePeca = lista.TPPC_DESCRICAO,
    classPeca = lista.TPPC_CLASSIFICACAO_PECAS,
    idCont = lista.ID_TIPO_PECA;
  console.log(lista);
  if (acessoGeral) {
    try {
      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();
        } else {
          if (idCont) {
            
            await connection.execute(
              `
              UPDATE  TIPO_PECA
                 SET  TPPC_DESCRICAO ='${nomePeca}',
                 TPPC_CLASSIFICACAO_PECAS ='${classPeca}'
               where  ID_TIPO_PECA ='${idCont}'
               `,

              [],
              { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
            );
            res.send("sucesso").status(200).end();
          } else {
            await connection.execute(
              `
              INSERT INTO TIPO_PECA(
                ID_TIPO_PECA,
                TPPC_DESCRICAO,
                TPPC_CLASSIFICACAO_PECAS
              )
              VALUES(
                SEQ_SECO.NEXTVAL,
                '${nomePeca}','${classPeca}'
              )`,
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

router.post("/excluirTipoPeca", async (req, res) => {
  const {idCont, token, acessoGeral
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
                  DELETE FROM TIPO_PECA 
                  WHERE  ID_TIPO_PECA = ${idCont}
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
          console.error('Erro ao Ecluir Cadastro', error);
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
