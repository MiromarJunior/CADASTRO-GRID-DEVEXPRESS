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

router.post("/listarStatusItem", async (req, res) => {
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
          select * from STATUS_ITEM

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

router.post("/saveStatusItem", async (req, res) => {
  const { lista, token, idSeg, acessoGeral } = req.body;
  let connection = await oracledb.getConnection(dbConfig);

  let codigoStit = lista.STIT_CODIGO,
    descStit = lista.STIT_DESCRICAO,
    respStit = lista.STIT_RESPONSAVEL,
    concstit = lista.STIT_CONCEITO,
    idCont = lista.ID_STATUS_ITEM;
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
              UPDATE  STATUS_ITEM
                 SET  STIT_CODIGO ='${codigoStit}',
                      STIT_DESCRICAO ='${descStit}',
                      STIT_RESPONSAVEL ='${respStit}',
                      STIT_CONCEITO = '${concstit}'
               where  ID_STATUS_ITEM ='${idCont}'
               `,

              [],
              { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
            );
            res.send("sucesso").status(200).end();
          } else {
            await connection.execute(
              `
              INSERT INTO STATUS_ITEM (
                ID_STATUS_ITEM,
                STIT_CODIGO,
                STIT_DESCRICAO,
                STIT_RESPONSAVEL,
                STIT_CONCEITO

              )
              VALUES(
                SEQ_SECO.NEXTVAL,
                '${codigoStit}','${descStit}','${respStit}','${concstit}'
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

router.post("/excluirStatusItem", async (req, res) => {
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
                  DELETE FROM STATUS_ITEM 
                  WHERE  ID_STATUS_ITEM = ${idCont}
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
