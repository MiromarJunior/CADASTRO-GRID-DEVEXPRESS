

const router = require("express").Router();
const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB/configDB.js");
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const { apenasNr } = require("../Service/utilServiceBackEnd.js");
const SECRET = process.env.SECRET;

router.post("/listarCategMsgs", async (req, res) => {
    const { token } = req.body;
    let connection = await oracledb.getConnection(dbConfig);
    let result;
    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();
        } else {
            try {
                result = await connection.execute(
                    `SELECT ID_CATEGORIA_MENSAGENS,
                            CTMN_DESCRICAO
                       FROM CATEGORIA_MENSAGENS
                    `,
                    [],
                    { outFormat: oracledb.OUT_FORMAT_OBJECT }
                );
                res.send(result.rows).status(200);
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

        }
    }
  )
});

router.post("/cadastrarCategMsgs", async (req, res) => {

    const { lista, token } = req.body
    let connection = await oracledb.getConnection(dbConfig);
    
    let idCategMsgs = lista.ID_CATEGORIA_MENSAGENS,
        descricao   = lista.CTMN_DESCRICAO;
    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();

        } else {

            try {
                
                if (idCategMsgs) {
    
                    await connection.execute(
                        ` UPDATE CATEGORIA_MENSAGENS 
                             SET CTMN_DESCRICAO = :CTMN_DESCRICAO
                            WHERE ID_CATEGORIA_MENSAGENS = :ID_CATEGORIA_MENSAGENS
                        `, [ descricao, idCategMsgs ],
                        {
                            outFormat: oracledb.OUT_FORMAT_OBJECT,
                            autoCommit: true
                        });

                } else {
                    let result = await connection.execute(
                        ` SELECT ID_CATEGORIA_MENSAGENS 
                            FROM CATEGORIA_MENSAGENS 
                           WHERE UPPER(CTMN_DESCRICAO) = UPPER(:CTMN_DESCRICAO)`,
                        [descricao],
                        { outFormat: oracledb.OUT_FORMAT_OBJECT });

                    if (result.rows.length > 0) { res.send("duplicidade").status(200).end(); }
                    else {
                        
                        await connection.execute(
                            ` INSERT INTO CATEGORIA_MENSAGENS(ID_CATEGORIA_MENSAGENS, 
                                                              CTMN_DESCRICAO)
                                                      VALUES (SEQ_CTMN.NEXTVAL,
                                                             :CTMN_DESCRICAO) `,
                            [descricao],
                            {
                                outFormat: oracledb.OUT_FORMAT_OBJECT,
                                autoCommit: true
                            });
                        res.send("sucesso").status(200).end();
                    }
                }
            } catch (error) {
                console.error(error);
                res.send("erro ao Cadastrar Categoria de Mensagens").status(500);
            } finally {
                if (connection) {
                    try {
                        await connection.close();

                    } catch (error) {
                        console.error(error);
                    }
                }
            }

        }
    });

});

router.post("/excluirCategMsgs", async (req, res) => {
    let = { idCategMsgs, token } = req.body
    let connection = await oracledb.getConnection(dbConfig);
    let result;
    let erroAcesso = "";

    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();

        } else {
            try {                
                let resExcl = await connection.execute(
                    ` DELETE FROM CATEGORIA_MENSAGENS
                       WHERE ID_CATEGORIA_MENSAGENS = :ID_CATEGORIA_MENSAGENS`,
                    [idCategMsgs],
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                        autoCommit: true
                    });

                resExcl.rowsAffected > 0 ? res.send("sucesso").status(200).end() : res.send("erro").status(200).end();
            } catch (error) {
                console.error(error);
                res.send("erro ao Excluir Categoria de Mensagens").status(500).end();
            } finally {
                if (connection) {
                    try {
                        await connection.close();

                    } catch (error) {
                        console.error(error);
                    }
                }
            }

        }
    });


});

module.exports = router;