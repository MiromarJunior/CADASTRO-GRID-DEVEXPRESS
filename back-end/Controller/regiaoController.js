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
// let connection = await oracledb.getConnection(dbConfig);
//await connection.execute(`alter session set nls_date_format = 'DD/MM/YYYY hh24:mi:ss'`); 

router.post("/listarRegiao", async (req, res) => {
    const { token, idReg,
    } = req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;
    let selectSql = "";
    if (idReg > 0) {
        selectSql = ` WHERE ID_REGIAO = ${idReg} `
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
                    SELECT  * FROM REGIAO REG
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


router.post("/cadastrarRegiao", async (req, res) => {
    let { lista, token, acessoGeral } = req.body;
    let regiaoID = lista.ID_REGIAO;
    let regiaoDescricao = lista.REGI_DESCRICAO;
    
    let insertSql;
    let selectSql;

    console.log('CadastrarRegiao.lista', lista);

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
                                VALUES (SEQ_REGI.NEXTVAL, :DESCRICAO
                                )
                            `
                    )

                    updateSql = (
                        ` UPDATE REGIAO
                            SET REGI_DESCRICAO = :DESCRICAO
                            WHERE ID_REGIAO = :REGI
                            `
                    )
                }
            });

            if (regiaoID > 0) {
                await connection.execute(
                    updateSql
                    ,
                    [regiaoDescricao, regiaoID],
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                        autoCommit: true
                    });
            } else {
                await connection.execute(
                    insertSql
                    ,
                    [regiaoDescricao],
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
                    console.error(error);
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

    console.log('Inicio excluirRegiao', req.body);

    let connection = await oracledb.getConnection(dbConfig);

    let deleteSql = "";
    // let deleteSql1 = "";

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
                    WHERE  ID_REGIAO = ${regiaoID}
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
            console.error('Erro ao Ecluir Regiao', error);
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