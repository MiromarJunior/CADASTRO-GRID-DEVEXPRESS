/*
componentes utilizados
#express
#jsonwebtoken
#oracledb
#bcrypt

/cadastrarUsuario recebe dados do fornt-end para cadastrar um novo usuário, 
mas antes verifica se o nome e cpf já estão cadastrados no banco.

/loginUsuario recebe o usuario e senha e faz a comparação para validar o login 
e responde com os dados de autenticação
 exclui os produtos recebidos pelo nr ID

*/



const router = require("express").Router();
const express = require("express");
const oracledb = require("oracledb");
const dbConfig = require("../ConfigDB/configDB.js");
const app = express();
app.use(express.json());
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;

router.post("/listarGrupoItem", async (req, res) => {
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
                    `SELECT ID_GRUPO_ITEM,
                            GRPO_DESCRICAO
                       FROM GRUPO_ITEM
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

router.post("/cadastrarGrupoItem", async (req, res) => {

    const { lista, token } = req.body
    let connection = await oracledb.getConnection(dbConfig);

    let idGrupoItem = lista.ID_GRUPO_ITEM,
        descricao = lista.GRPO_DESCRICAO;
    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();

        } else {

            try {

                if (idGrupoItem) {

                    await connection.execute(
                        ` UPDATE GRUPO_ITEM 
                             SET GRPO_DESCRICAO = :GRPO_DESCRICAO
                            WHERE ID_GRUPO_ITEM = :ID_GRUPO_ITEM
                        `, [descricao, idGrupoItem],
                        {
                            outFormat: oracledb.OUT_FORMAT_OBJECT,
                            autoCommit: true
                        });

                } else {
                    let result = await connection.execute(
                        ` SELECT ID_GRUPO_ITEM 
                            FROM GRUPO_ITEM 
                           WHERE UPPER(GRPO_DESCRICAO) = UPPER(:GRPO_DESCRICAO)`,
                        [descricao],
                        { outFormat: oracledb.OUT_FORMAT_OBJECT });

                    if (result.rows.length > 0) { res.send("duplicidade").status(200).end(); }
                    else {

                        await connection.execute(
                            ` INSERT INTO GRUPO_ITEM(ID_GRUPO_ITEM, 
                                                     GRPO_DESCRICAO)
                                              VALUES (SEQ_GRPO.NEXTVAL,
                                                      :GRPO_DESCRICAO) `,
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
                res.send("erro ao Cadastrar Grupo Item").status(500);
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

router.post("/excluirGrupoItem", async (req, res) => {
    let = { idGrupoItem, token } = req.body
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

                let result = await connection.execute(
                    ` SELECT ID_SUBGRUPO_ITEM 
                        FROM SUBGRUPO_ITEM 
                       WHERE ID_GRUPO_ITEM = :ID_GRUPO_ITEM`,
                    [idGrupoItem],
                    { outFormat: oracledb.OUT_FORMAT_OBJECT });
                if (result.rows.length > 0) { 
                    res.send("ERROFK").status(200).end(); 
                } else 
                {
                    let resExcl = await connection.execute(
                        ` DELETE FROM GRUPO_ITEM
                       WHERE ID_GRUPO_ITEM = :ID_GRUPO_ITEM`,
                        [idGrupoItem],
                        {
                            outFormat: oracledb.OUT_FORMAT_OBJECT,
                            autoCommit: true
                        });

                    resExcl.rowsAffected > 0 ? res.send("sucesso").status(200).end() : res.send("erro").status(200).end();
                }
            } catch (error) {
                console.error(error);
                res.send("erro ao Excluir Grupo Item").status(500).end();
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