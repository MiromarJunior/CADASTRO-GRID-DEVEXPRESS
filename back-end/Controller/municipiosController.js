
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
    const { token, idMUNI,
    } = req.body;

    let connection = await oracledb.getConnection(dbConfig);
    let result;
    let selectSql = "";
    if (idMUNI > 0) {
        selectSql = ` WHERE ID_MUNICIPIO = ${idMUNI} `
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
            SELECT  * FROM MUNICIPIOS MUNI
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



router.post("/cadastrarMunicipios", async (req, res) => {
    let { muniCodigo, muniDescricao, idUnidadeFederativa, idMUNI, token, acessoGeral } = req.body;
    let insertSql;
    let selectSql;
    let updateSql;

    const senhaC = bcrypt.hashSync(senhaEmailSist, saltRounds);

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
                        ` INSERT INTO MUNICIPIOS(ID_MUNICIPIO,
            MUNI_CODIGO, MUNI_DESCRICAO, ID_UNIDADE_FEDERATIVA)
            VALUES(SEQ_MUN.NEXTVAL, :CODIGO, :DESCRICAO, :ID_UNIDADE_FEDERATIVA
            )
          `
                    )

                    updateSql = (
                        ` UPDATE MUNICIPIOS 
          SET MUNI_CODIGO = :CODIGO
              MUNI_DESCRICAO = :DESCRICAO,
              ID_UNIDADE_FEDERATIVA = :ID_UNIDADE_FEDERATIVA
          WHERE ID_MUNICIPIOS = :MUNI
        `
                    )

                    selectSql = (
                        `SELECT MUN.ID_MUNICIPIOS from MUNICIPIO MUN
          WHERE mun.MUN_CODIGO :MUNI_CODIGO
        `
                    )

                }
            });


            if (idReg > 0) {
                await connection.execute(
                    updateSql
                    ,
                    [muniCodigo, muniDescricao, idUnidadeFederativa, idMUNI],
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                        autoCommit: true
                    });

            } else {

                await connection.execute(
                    insertSql
                    ,
                    [muniCodigo, muniDescricao,  idUnidadeFederativa],
                    {
                        outFormat: oracledb.OUT_FORMAT_OBJECT,
                        autoCommit: true
                    });
            }

            let result = await connection.execute(selectSql
                ,
                [muniCodigo],
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT

                });
            res.send(result.rows).status(200).end();

        } catch (error) {

            console.error("erro aqui", error);
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


router.post("/excluirMunicipios", async (req, res) => {
    const { token, idMuni, acessoGeral
    } = req.body;

    let connection = await oracledb.getConnection(dbConfig);

    let deleteSql = "";
    let deleteSql1 = "";

    if (acessoGeral) {

        jwt.verify(token, SECRET, async (err, decoded) => {
            if (err) {
                console.error(err, "err");
                erroAcesso = "erroLogin";
                res.send("erroLogin").end();

            } else {

                deleteSql = (
                    ` 
          DELETE FROM MUNICIPIOS
          WHERE  ID_MUNICIPIO = ${idMuni}
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


module.exports = router;