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

router.post("/listarJustificativaItem", async (req, res) => {
    const { token } = req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;

    // console.log('listarJustificativaItem', req.body)

    try {
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                console.error(err, "err");
                erroAcesso = "erroLogin";
                res.send("erroLogin").end();
                return;
            } else {
                result = await connection.execute(
                    ` 
                    SELECT  * FROM JUSTIFICATIVA_ITEM JSIT
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
        console.error('Erro na listagem de Justificativa de Item', error);
        res.send("erro de conexao").status(500);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Erro ao fechar conexão para consulta de Justificativas de item.', error);
            }
        }
    }
});

router.post("/cadastrarJustificativaItem", async (req, res) => {
    let { lista, token, acessoGeral } = req.body;
    let justificativaItemID = lista.ID_JUSTIFICATIVA_ITEM;
    let justificativaItemDescricao = lista.JSIT_DESCRICAO;

    let insertSql;

    // console.log('CadastrarJustificativaItem', req.ody);

    let connection = await oracledb.getConnection(dbConfig);

    if (acessoGeral) {
        try {
            jwt.verify(token, SECRET, async (err, decoded) => {
                if (err) {
                    console.error(err, "err");
                    erroAcesso = "erroLogin";
                    res.send("erroLogin").end();
                    return;
                } else {
                    insertSql = (
                        ` INSERT INTO JUSTIFICATIVA_ITEM(ID_JUSTIFICATIVA_ITEM, JSIT_DESCRICAO)
                                VALUES (SEQ_JSIT.NEXTVAL, '${justificativaItemDescricao}'
                                )
                            `
                    )

                    updateSql = (
                        ` UPDATE JUSTIFICATIVA_ITEM
                            SET JSIT_DESCRICAO = '${justificativaItemDescricao}'
                            WHERE ID_JUSTIFICATIVA_ITEM = '${justificativaItemID}'
                            `
                    )
                }
            });

            if (justificativaItemID > 0) {
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
            console.error("CadastrarJustificativaItem -> erro ao Salvar Justificativa do Item: ", error);
            res.send("erroSalvar").status(500);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Erro no close da connection ao Cadastrar Justificativa do Item', error);
                }
            }
        }

    } else {
        res.send("semAcesso").status(200).end();
    }
});

router.post("/excluirJustificativaItem", async (req, res) => {
    const { justificativaItemID, token, acessoGeral } = req.body;

    // console.log('excluirJustificativaItem', req.body);

    let connection = await oracledb.getConnection(dbConfig);

    let deleteSql = "";

    if (acessoGeral) {
        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                console.error(err, "err");
                erroAcesso = "erroLogin";
                res.send("erroLogin").end();
                return;
            } else {
                deleteSql = (
                    ` 
                    DELETE FROM JUSTIFICATIVA_ITEM 
                    WHERE  ID_JUSTIFICATIVA_ITEM = '${justificativaItemID}'
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
            console.error('Erro ao Ecluir Justificativa do Item', error);
            res.send("erroSalvar").status(500);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Erro no Close da conecction de excluir justificativa do item', error);
                }
            }
        }
    } else {
        res.send("semAcesso").status(200).end();
    }
});

module.exports = router;