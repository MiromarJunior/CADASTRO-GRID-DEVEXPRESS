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

router.post("/listarSac", async (req, res) => {
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
          select * from SAC_MONTADORAS

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

router.post("/saveSac", async (req, res) => {
  const { lista, token, idSeg, acessoGeral } = req.body;
  let connection = await oracledb.getConnection(dbConfig);

  let nomeCont = lista.SCMN_MARCA,
    emailCont = lista.SCMN_EMAIL,
    nrCelCont = lista.SCMN_TELEFONE,
    idCont = lista.ID_SAC_MONTADORAS;
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
              UPDATE  SAC_MONTADORAS
                 SET  SCMN_MARCA ='${nomeCont}',
                      SCMN_EMAIL ='${emailCont}',
                      SCMN_TELEFONE ='${apenasNr(nrCelCont)}'
               where  ID_SAC_MONTADORAS ='${idCont}'
               `,

              [],
              { outFormat: oracledb.OUT_FORMAT_OBJECT, autoCommit: true }
            );
            res.send("sucesso").status(200).end();
          } else {
            await connection.execute(
              `
              INSERT INTO SAC_MONTADORAS(
                ID_SAC_MONTADORAS,
                SCMN_MARCA,
                SCMN_EMAIL,
                SCMN_TELEFONE

              )
              VALUES(
                SEQ_SECO.NEXTVAL,
                '${nomeCont}','${emailCont}','${nrCelCont}'
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

router.post("/excluirSac", async (req, res) => {
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
                  DELETE FROM SAC_MONTADORAS 
                  WHERE  ID_SAC_MONTADORAS = ${idCont}
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
