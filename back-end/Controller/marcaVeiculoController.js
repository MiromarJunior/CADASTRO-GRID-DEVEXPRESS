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


router.post("/listarMarcaVeiculo", async (req, res) => {
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
          select * from MARCA_VEICULO
      
            
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

router.post("/excluirMarcaVeiculo", async (req, res) => {
  const { token, idMa, acessoGeral
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
          DELETE FROM MARCA_VEICULO 
          WHERE  ID_MARCA_VEICULO = ${idMa}
           
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
      console.error(error, 'Erro ao tentar deletar marca veiculo.');
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

router.post("/cadastrarMarcaVeiculo", async (req, res) => {
  const {
    token, idMa, acessoGeral, descricao, posLogChat, logo, logoApont, imagemChat, imagemChatColor } = req.body;
  let connection = await oracledb.getConnection(dbConfig);


  if (acessoGeral) {
    try {

      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

        } else {

          if (idMa) {
            await connection.execute(`
                UPDATE  MARCA_VEICULO
                 SET  MRVC_DESCRICAO = '${descricao}',
                 MRVC_POSICAO_LOGO_CHAT = '${posLogChat}',
                 MRVC_IMAGEM_LOGO = '${logo}',
                 MRVC_IMAGEM_LOGO_APONTADOR ='${logoApont}',
                 MRVC_IMAGEM_CHAT ='${imagemChat}}',
                 MRVC_IMAGEM_CHAT_COLORIDO ='${imagemChatColor}'
                 WHERE ID_MARCA_VEICULO = '${idMa}'                
                `

              , [], {
              outFormat: oracledb.OUT_FORMAT_OBJECT,
              autoCommit: true
            });
            res.send("sucessoU").status(200).end();

          } else {

            await connection.execute(
              ` 
              INSERT INTO MARCA_VEICULO(
                ID_MARCA_VEICULO,
                MRVC_DESCRICAO,
                MRVC_POSICAO_LOGO_CHAT,
                MRVC_IMAGEM_LOGO,
                MRVC_IMAGEM_LOGO_APONTADOR,
                MRVC_IMAGEM_CHAT,
                MRVC_IMAGEM_CHAT_COLORIDO
                )
              VALUES(
                SEQ_MRVC.NEXTVAL,
                '${descricao}','${posLogChat}','${logo}','${logoApont}','${imagemChat}','${(imagemChatColor)}'
              )           
              
              `,
              [],
              {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true
              });
            res.send("sucesso").status(200).end();
          }




        }
      })

    } catch (error) {
      console.error(error, 'Erro ao tentar cadastrar marca de veiculo.');
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