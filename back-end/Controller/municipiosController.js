
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

router.post("/listarMunicipios", async (req, res) => {
    const { token } = req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;

    // console.log('Listar Municipios LOG', req.body);

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
                        SELECT  MUNI.ID_MUNICIPIO, MUNI.MUNI_CODIGO, MUNI.MUNI_DESCRICAO, UF.UNFE_SIGLA
                          FROM MUNICIPIOS MUNI ,
                               UNIDADE_FEDERATIVA UF
                        WHERE MUNI.ID_UNIDADE_FEDERATIVA = UF.ID_UNIDADE_FEDERATIVA(+)
                    `,
                    [],
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                    }
                );

                //   console.log('LIstar Municipios LOG - Resultado Consulta.', result.rows);
                res.send(result.rows).status(200).end();
            }
        })
    } catch (error) {
        console.error('Erro na consulta de Municipios', error);
        res.send("erro de conexao").status(500);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.error('Erro no Close do connection da consulta de municípios.', error);
            }
        }
    }
});


router.post("/cadastrarMunicipios", async (req, res) => {
    let { lista, token, acessoGeral } = req.body;

    console.log('req.body de cadastrarMunicipios', req.body);

    let insertSql;
    // let selectSql;
    let updateSql;

    let municipioID = lista.ID_MUNICIPIO;
    let municipioCodigo = lista.MUNI_CODIGO;
    let municipioDescricao = lista.MUNI_DESCRICAO;
    // let municipioUnidadeFederativaID = lista.UNFE_SIGLA;
    let municipioUF = lista.UNFE_SIGLA;

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
                        ` INSERT INTO MUNICIPIOS(ID_MUNICIPIO, MUNI_CODIGO, MUNI_DESCRICAO, ID_UNIDADE_FEDERATIVA)
                                          VALUES(SEQ_MUNI.NEXTVAL, '${municipioCodigo}', '${municipioDescricao}', (select ID_UNIDADE_FEDERATIVA from UNIDADE_FEDERATIVA UF where UF.UNFE_SIGLA = '${municipioUF}' and rownum <= 1)
                        )
                `
                    )

                    updateSql = (
                        ` UPDATE MUNICIPIOS 
                             SET MUNI_CODIGO           = '${municipioCodigo}',
                                 MUNI_DESCRICAO        = '${municipioDescricao}',
                                 ID_UNIDADE_FEDERATIVA = (select ID_UNIDADE_FEDERATIVA from UNIDADE_FEDERATIVA UF where UF.UNFE_SIGLA = '${municipioUF}' and rownum <= 1)
                           WHERE ID_MUNICIPIO          = '${municipioID}'
                            `
                    )
                }
            });

            if (municipioID > 0) {
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

            res.send('Sucesso').status(200).end();
        } catch (error) {
            console.error("erro ao salvar Municipios", error);
            res.send("erroSalvar").status(500);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Erro no close da connection de salvar Municipios.', error);
                }
            }
        }
    } else {
        res.send("semAcesso").status(200).end();
    }
});


router.post("/excluirMunicipios", async (req, res) => {
    const { municipioID, token, acessoGeral
    } = req.body;

    console.log('req.body de excluirMunicipios', req.body)

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
                    DELETE FROM MUNICIPIOS
                    WHERE  ID_MUNICIPIO = '${municipioID}'
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
            console.error('erro ao excluir municipio.', error);
            res.send("erro de conexao").status(500);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.error('Erro no close da connection do excluir municipios.', error);
                }
            }
        }
    } else {
        res.send("semAcesso").status(200).end();
    }
});


module.exports = router;