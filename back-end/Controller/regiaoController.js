const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const dbConfig = require("../ConfigDB/configDB.js");

const app = express();
app.use(express.json());

router.post("/listarRegiao", async (req, res) => {
    const { token } = req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;

    try {
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                console.error(err, "err");
                erroAcesso = "erroLogin";
                res.send("erroLogin").end();
            } else {
                result = await connection.execute(
                    ` 
                    SELECT  * FROM REGIAO REG
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
        console.error('Erro Listar Regiao', error);
        res.send("erro de conexao").status(500);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Erro no Close da connection ao listar Região', error);
            }
        }
    }
});

router.post("/cadastrarRegiao", async (req, res) => {
    let { lista, token, acessoGeral } = req.body;
    let regiaoID = lista.ID_REGIAO;
    let regiaoDescricao = lista.REGI_DESCRICAO;

    let insertSql;

    // console.log('CadastrarRegiao', req.body);

    let connection = await oracledb.getConnection(dbConfig);

    if (acessoGeral) {
        try {
            jwt.verify(token, SECRET, async (err, decoded) => {
                if (err) {
                    console.error(err, "err");
                    erroAcesso = "erroLogin";
                    res.send("erroLogin").end();
                } else {
                    insertSql = (
                        ` INSERT INTO REGIAO(ID_REGIAO,
                                REGI_DESCRICAO)
                                VALUES (SEQ_REGI.NEXTVAL, '${regiaoDescricao}'
                                )
                            `
                    )

                    updateSql = (
                        ` UPDATE REGIAO
                            SET REGI_DESCRICAO = '${regiaoDescricao}'
                            WHERE ID_REGIAO = '${regiaoID}'
                            `
                    )
                }
            });

            if (regiaoID > 0) {
                await connection.execute(
                    updateSql
                    ,
                    [],
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                        autoCommit: true
                    });
            } else {
                await connection.execute(
                    insertSql
                    ,
                    [],
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                        autoCommit: true
                    });
            }

            // aparentemente nao ha validacao para insercao com descricao duplicada, e o resultado teria a duplicidade.           
            res.send('Sucesso').status(200).end();
        } catch (error) {
            console.error("CadastrarRegiao -> erro ao Salvar Regiao: ", error);
            res.send("erroSalvar").status(500);
        } finally {
            if (connection) {
                try {
                    await connection.close();

                } catch (error) {
                    console.error('Erro ao fechar coneccection de cadastro de Região', error);
                }
            }
        }
    } else {
        res.send("semAcesso").status(200).end();
    }
});

router.post("/excluirRegiao", async (req, res) => {
    const { regiaoID, token, acessoGeral
    } = req.body;

    // console.log('Inicio excluirRegiao', req.body);

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
                    DELETE FROM REGIAO 
                    WHERE  ID_REGIAO = '${regiaoID}'
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
            console.error('Erro ao Excluir Regiao', error);
            res.send("erroSalvar").status(500);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Erro no close da connection de excluir Região', error);
                }
            }
        }
    } else {
        res.send("semAcesso").status(200).end();
    }
});

module.exports = router;