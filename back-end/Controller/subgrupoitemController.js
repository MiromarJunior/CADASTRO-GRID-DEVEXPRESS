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

router.post("/listarSubGrupoItem", async (req, res) => {
    const { token, idGrupo } = req.body;
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
                    `SELECT ID_SUBGRUPO_ITEM,
                            SBGR_DESCRICAO,
                            SBGR_FORNECE_GENUINA_ORIGINAL,
                            ID_GRUPO_ITEM
                       FROM  SUBGRUPO_ITEM
                        WHERE ID_GRUPO_ITEM = :ID_GRUPO_ITEM
                    `,
                    [idGrupo],
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

router.post("/buscaGrupoItem", async (req, res) => {
    const { token, idGrupo } = req.body;
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
                    `SELECT GRPO_DESCRICAO
                       FROM GRUPO_ITEM
                      WHERE ID_GRUPO_ITEM = :ID_GRUPO_ITEM
                    `,
                    [idGrupo],
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


router.post("/cadastrarSubGrupoItem", async (req, res) => {

    const { lista, token, idGrupo } = req.body
    let connection = await oracledb.getConnection(dbConfig);
    
    let idSubGrupoItem = lista.ID_SUBGRUPO_ITEM ,
          descricao = lista.SBGR_DESCRICAO,
          fornece = lista.SBGR_FORNECE_GENUINA_ORIGINAL;
    jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
            console.error(err, "err");
            erroAcesso = "erroLogin";
            res.send("erroLogin").end();

        } else {

            try {
                
                if (idSubGrupoItem) {
    
                    await connection.execute(
                        ` UPDATE SUBGRUPO_ITEM 
                             SET SBGR_DESCRICAO = :SBGR_DESCRICAO,
                                 SBGR_FORNECE_GENUINA_ORIGINAL = :SBGR_FORNECE_GENUINA_ORIGINAL,
                                 ID_GRUPO_ITEM = :ID_GRUPO_ITEM
                            WHERE ID_SUBGRUPO_ITEM = :ID_SUBGRUPO_ITEM
                        `, [ descricao, fornece, idGrupo, idSubGrupoItem ],
                        {
                            outFormat: oracledb.OUT_FORMAT_OBJECT,
                            autoCommit: true
                        });

                } else {
                    let result = await connection.execute(
                        ` SELECT ID_SUBGRUPO_ITEM 
                            FROM SUBGRUPO_ITEM 
                           WHERE UPPER(SBGR_DESCRICAO) = UPPER(:SBGR_DESCRICAO)`,
                        [descricao],
                        { outFormat: oracledb.OUT_FORMAT_OBJECT });

                    if (result.rows.length > 0) { res.send("duplicidade").status(200).end(); }
                    else {
                        
                        await connection.execute(
                            ` INSERT INTO SUBGRUPO_ITEM(ID_SUBGRUPO_ITEM, 
                                                        SBGR_DESCRICAO,
                                                        SBGR_FORNECE_GENUINA_ORIGINAL,
                                                        ID_GRUPO_ITEM)
                                              VALUES (SEQ_SBGR.NEXTVAL, 
                                                     :SBGR_DESCRICAO,
                                                     :SBGR_FORNECE_GENUINA_ORIGINAL,
                                                     :ID_GRUPO_ITEM) `,
                            [descricao, fornece, idGrupo],
                            {
                                outFormat: oracledb.OUT_FORMAT_OBJECT,
                                autoCommit: true
                            });
                        res.send("sucesso").status(200).end();
                    }
                }
            } catch (error) {
                console.error(error);
                res.send("erro ao Cadastrar SubGrupo Item").status(500);
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

router.post("/excluirSubGrupoItem", async (req, res) => {
    let = { idSubGrupoItem, token } = req.body
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
                    ` DELETE FROM SUBGRUPO_ITEM
                       WHERE ID_SUBGRUPO_ITEM = :ID_SUBGRUPO_ITEM`,
                    [idSubGrupoItem],
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                        autoCommit: true
                    });

                resExcl.rowsAffected > 0 ? res.send("sucesso").status(200).end() : res.send("erro").status(200).end();
            } catch (error) {
                console.error(error);
                res.send("erro ao Excluir SubGrupo Item").status(500).end();
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