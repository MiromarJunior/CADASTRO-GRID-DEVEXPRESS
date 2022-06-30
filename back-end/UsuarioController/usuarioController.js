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
const { apenasNr } = require("../Service/utilServiceBackEnd.js");
const SECRET = process.env.SECRET;

router.post("/listarUsu", async(req, res)=> {
  const  {token} = req.body;
    let connection = await oracledb.getConnection(dbConfig);
    let result;


    jwt.verify(token, SECRET, async (err, decoded) => {
      if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();
      } else{  

        try {

          result = await connection.execute (
              `SELECT DISTINCT U.ID_USUARIO,
              U.USRO_USUARIO,
              U.USRO_NOME,                
              U.USRO_CATEGORIA,
              U.USRO_CNPJ_FORNECEDOR,
              U.USRO_CPF,
              (SELECT LISTAGG(GRACI.GRAC_DESCRICAO, ',') WITHIN GROUP(ORDER BY GRACI.GRAC_DESCRICAO)
                 FROM GRUPO_ACESSO GRACI
                 LEFT JOIN USRO_GRAC USGRI
                   ON GRACI.GRAC_CODIGO = USGRI.GRAC_CODIGO
                WHERE USGRI.ID_USUARIO = U.ID_USUARIO) GRUPO_ACE
      FROM USUARIO U
      LEFT JOIN USRO_GRAC USGR
      ON U.ID_USUARIO = USGR.ID_USUARIO
      LEFT JOIN GRUPO_ACESSO GRAC
      ON GRAC.GRAC_CODIGO = USGR.GRAC_CODIGO
              
              `,
              [],
              { outFormat  :  oracledb.OUT_FORMAT_OBJECT} 
               );
               res.send(result.rows).status(200);
              
          
            
        } catch (error) {
            console.error(error);
            res.send("erro de conexao").status(500);
            
        }finally {
            if(connection){
                try {
                    await connection.close();
                   
                } catch (error) {
                  console.error(error);              
                }
            }
        }
                      
      }
  })  

 




});

router.post("/cadastrarUsuario", async(req, res)=> {
  const {lista, token} =req.body
  let connection = await oracledb.getConnection(dbConfig);
  let senhaSQL = "", senhaC =  "";
  let idUsu = lista.ID_USUARIO,
  usuario = lista.USRO_USUARIO,
  nomeUsu = lista.USRO_NOME, 
  senhaUsu = lista.SENHA,
  categoria = lista.USRO_CATEGORIA,
  cnpjForn = apenasNr(lista.USRO_CNPJ_FORNECEDOR), 
  cpfUsu = apenasNr(lista.USRO_CPF),
  grupoAcesso = lista.GRUPO_ACE;  


  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

    } else{  

      try {

        if(idUsu){
          
          if(senhaUsu === null || senhaUsu === undefined || senhaUsu === ""){
          senhaC = "";
          senhaSQL = ""
          }else{
            senhaC = bcrypt.hashSync(senhaUsu,saltRounds);
             senhaSQL = `,USRO_SENHA =  '${senhaC}'`
          }
        
         
                await connection.execute( 
              ` UPDATE USUARIO 
                SET USRO_NOME = '${nomeUsu}',
                USRO_CPF = '${cpfUsu}',       
                USRO_USUARIO = '${usuario}',          
                USRO_CATEGORIA = '${categoria}',
                USRO_CNPJ_FORNECEDOR = '${cnpjForn}'
                ${senhaSQL}
                WHERE  ID_USUARIO = '${idUsu}'   
                
               `
          
              ,[],
              { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit : true
              });

              if(grupoAcesso){ 
              let saveUpdateSql = "";  
              let resultGR =  await connection.execute( 
                  `
                  SELECT ID_USUARIO FROM USRO_GRAC
                  WHERE ID_USUARIO = ${idUsu}             
                   `            
                  ,[],
                  { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                    
                  });
                  if(resultGR.rows.length > 0){

                    saveUpdateSql = 
                    `
                    UPDATE USRO_GRAC
                    SET ID_USUARIO = ${idUsu},
                    GRAC_CODIGO = (
                        SELECT GRAC_CODIGO FROM GRUPO_ACESSO GA
                        WHERE GA.GRAC_DESCRICAO = '${grupoAcesso}'
                      )
                      WHERE ID_USUARIO = ${idUsu}     
                    `  


                  }else{
                    saveUpdateSql = 
                    `
                    INSERT INTO USRO_GRAC(
                      ID_USUARIO,
                      GRAC_CODIGO
                    )VALUES(${idUsu},
                      (
                        SELECT GRAC_CODIGO FROM GRUPO_ACESSO GA
                        WHERE GA.GRAC_DESCRICAO = '${grupoAcesso}'
                      ))        
                    `  
                  }

                  await connection.execute(
                    saveUpdateSql
                      ,[],
                      { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                        autoCommit : true
                      });

         

             

              }








               res.send("sucessoU").status(200).end();
              
             
      
        }else{
          
      
          let result = await connection.execute ( 
            ` SELECT USRO_CPF FROM USUARIO 
            WHERE USRO_CPF = '${cpfUsu}' 
            OR USRO_USUARIO = '${usuario}'`,
        
            [],
            { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
              
            } 
             );
             if(result.rows.length > 0){
              res.send("duplicidade").status(200).end();
             }else{
             
              senhaC = bcrypt.hashSync(senhaUsu,saltRounds);
                await connection.execute( 
              ` INSERT INTO USUARIO(ID_USUARIO,
                USRO_NOME,
                USRO_CPF,       
                USRO_USUARIO,
                USRO_SENHA,
                USRO_CATEGORIA,
                USRO_CNPJ_FORNECEDOR       
                )
                VALUES(SEQ_USRO.NEXTVAL,'${nomeUsu}', '${cpfUsu}', '${usuario}', '${senhaC}', '${categoria}','${cnpjForn}') `,
          
              [],
              { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                autoCommit : true
              } 
               );
                if(grupoAcesso){ 
                let saveUpdateSql = "";  
                let resultGR =  await connection.execute( 
                    `
                    SELECT ID_USUARIO FROM USUARIO
                    WHERE USRO_USUARIO = '${usuario}'            
                     `            
                    ,[],
                    { outFormat  :  oracledb.OUT_FORMAT_ARRAY,
                      
                    });
                                       
                      saveUpdateSql = 
                      `
                      INSERT INTO USRO_GRAC(
                        ID_USUARIO,
                        GRAC_CODIGO
                      )VALUES('${resultGR.rows.toString()}',
                        (
                          SELECT GRAC_CODIGO FROM GRUPO_ACESSO GA
                          WHERE GA.GRAC_DESCRICAO = '${grupoAcesso}'
                        ))        
                      `  
                    
  
                    await connection.execute(
                      saveUpdateSql
                        ,[],
                        { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
                          autoCommit : true
                        });
  
           
  
               
  
                }










               res.send("sucesso").status(200).end();              
             }      
        }
       
          
      } catch (error) {        
          console.error(error);
          res.send("erro ao Cadastrar usuário").status(500);             
      }finally {
          if(connection){
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

router.post("/loginUsuario", async(req, res)=> {
  let {usuario, senha} =req.body;
  let connection = await oracledb.getConnection(dbConfig);
  let result;
  let  = usuarioLocal = "";
  let senhaLocal = "";
  let validaSenha = false;
  let token = "";

try {

  result = await connection.execute ( 

      ` SELECT *FROM USUARIO USRO
        WHERE USRO_USUARIO =:USUARIO  `,
      [usuario],
      { outFormat  :  oracledb.OUT_FORMAT_OBJECT} 
       );     

       if(result.rows.length > 0){
         result.rows.map((l)=>{
           usuarioLocal = l.USRO_USUARIO;
           senhaLocal = l.USRO_SENHA;
         });
         validaSenha = bcrypt.compareSync(senha,senhaLocal);
         if(usuarioLocal === usuario && (validaSenha)){
          token = jwt.sign({},SECRET,{expiresIn : "1h"});
          res.send({ Usuario: usuarioLocal, token: token }).status(200).end();
 
        }else{
          res.send("Usuário ou senha inválido").status(200).end();
        }


       }         
       else{
         res.send("Usuário não encontrado !!").status(200).end();
       }
      
      
  
    
} catch (error) {
    console.error(error);
    res.send("erro ao tentar logar").status(500);
    
}finally {
    if(connection){
        try {
            await connection.close();
            
        } catch (error) {
          console.error(error);              
        }
    }
}




});

router.post("/excluirUsuario", async(req, res)=> {
  let ={idUsu, token} =req.body
  let connection = await oracledb.getConnection(dbConfig);
  let result;
  let erroAcesso = "";




  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

    } else{  
      try {


        await connection.execute ( 
          ` DELETE FROM USRO_GRAC
          WHERE ID_USUARIO = ${idUsu}
          
          `
          ,
      
          [],
          { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
            autoCommit : true
          });
 
    
      let resExcl =   await connection.execute ( 
      ` DELETE FROM USUARIO
      WHERE ID_USUARIO = ${idUsu}`,
  
      [],
      { outFormat  :  oracledb.OUT_FORMAT_OBJECT,
        autoCommit : true
      });
     
      resExcl.rowsAffected > 0 ? res.send("sucesso").status(200).end() : res.send("erro").status(200).end();
 

       
      
     
    
} catch (error) {
  
    console.error(error);
    res.send("erro ao Excluir usuário").status(500).end();
  
    
}finally {
    if(connection){
        try {
            await connection.close();
         
        } catch (error) {
          console.error(error);              
        }
    }
}     
                    
    }
}) ; 
 

});

router.post("/listarGrupoAcesso", async(req, res)=> {
  const {token} =req.body;
  let connection = await oracledb.getConnection(dbConfig);
  let result;
  

  jwt.verify(token, SECRET, async (err, decoded) => {
    if (err) {
        console.error(err, "err");
        erroAcesso = "erroLogin";
        res.send("erroLogin").end();

    } else{  
      try {

        result = await connection.execute (       
            `     
            SELECT * FROM GRUPO_ACESSO  
            
            `,
            [],
            { outFormat  :  oracledb.OUT_FORMAT_OBJECT} 
             );
             res.send(result.rows).status(200).end();            
        
          
      } catch (error) {
          console.error(error);
          res.send("erro de conexao").status(500).end();
          
      }finally {
          if(connection){
              try {
                  await connection.close();
                 
              } catch (error) {
                console.error(error);              
              }
          }
      }
                    
    }
})  

});


module.exports = router;

/**
 * 
 * 
 * 
 * 
 
SELECT DISTINCT U.ID_USUARIO,
                U.USRO_USUARIO,
                U.USRO_NOME,                
                U.USRO_CATEGORIA,
                U.USRO_CNPJ_FORNECEDOR,
                U.USRO_CPF,
                (SELECT LISTAGG(GRACI.GRAC_DESCRICAO, ',') WITHIN GROUP(ORDER BY GRACI.GRAC_DESCRICAO)
                   FROM GRUPO_ACESSO GRACI
                   LEFT JOIN USRO_GRAC USGRI
                     ON GRACI.GRAC_CODIGO = USGRI.GRAC_CODIGO
                  WHERE USGRI.ID_USUARIO = U.ID_USUARIO) GRUPO_ACE
  FROM USUARIO U
  LEFT JOIN USRO_GRAC USGR
    ON U.ID_USUARIO = USGR.ID_USUARIO
  LEFT JOIN GRUPO_ACESSO GRAC
    ON GRAC.GRAC_CODIGO = USGR.GRAC_CODIGO



 */