const router = require("express").Router();
const express = require("express");
const jwt = require("jsonwebtoken");
const SECRET = process.env.SECRET;
const oracledb = require("oracledb");
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sharp = require("sharp");
const dbConfig = require("../ConfigDB/configDB.js");
const { apenasNr } = require("../Service/utilServiceBackEnd.js");


const app = express();
app.use(express.json());
const multer  = require('multer')
const storage = multer.diskStorage({
  destination : (req,file,cb)=>{
    cb(null,'uploads/')
  },
  filename : (req, file, cb)=>{
    cb(null,file.fieldname+".png")
  },
  limits: {
    fileSize: 10
  },

});
const upload = multer({storage : storage});
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
router.post("/cadastrarMarcaVeiculo",upload.any("logo","logoApont","imagemChat","imagemChatColor"),async (req, res) => {
 
  const {
    token, idMa, acessoGeral, descricao, posLogChat } = req.body;
  let connection = await oracledb.getConnection(dbConfig);

 const fs = require('fs');
 let logo = "",
 logoApont = "",
 imagemChat = "",
 imagemChatColor = "";
 if(fs.existsSync("./uploads/logo.png")){  
  await  sharp("./uploads/logo.png").clone()
  .resize({width : 120, height : 100})  
  .toFile("./uploads/logos.png");   
  if(fs.existsSync("./uploads/logos.png")){
    logo = fs.readFileSync(`./uploads/logos.png`);
  } 

 }
 if(fs.existsSync("./uploads/logoApont.png")){
   await  sharp("./uploads/logoApont.png").clone()
  .resize({width : 48, height : 48})  
  .toFile("./uploads/logoAponts.png");   
  if(fs.existsSync("./uploads/logoAponts.png")){
    logoApont = fs.readFileSync(`./uploads/logoAponts.png`);
  } 
 }
 if(fs.existsSync("./uploads/imagemChat.png")){
  
  await  sharp("./uploads/imagemChat.png").clone()
  .resize({width : 120, height : 100})  
  .toFile("./uploads/imagemChats.png");   
  if(fs.existsSync("./uploads/imagemChats.png")){
    imagemChat = fs.readFileSync(`./uploads/imagemChats.png`);
  } 
 }
 if(fs.existsSync("./uploads/imagemChatColor.png")){  
  await  sharp("./uploads/imagemChatColor.png").clone()
  .resize({width : 120, height : 100})  
  .toFile("./uploads/imagemChatColors.png");   
  if(fs.existsSync("./uploads/imagemChatColors.png")){
    imagemChatColor = fs.readFileSync(`./uploads/imagemChatColors.png`);
  } 
 }

  if (acessoGeral) {
    try {

      jwt.verify(token, SECRET, async (err, decoded) => {
        if (err) {
          console.error(err, "err");
          erroAcesso = "erroLogin";
          res.send("erroLogin").end();

        } else {

          if (idMa > 0) {
          let resultUP =  await connection.execute(`
                UPDATE  MARCA_VEICULO
                 SET  MRVC_DESCRICAO = :DES,
                 MRVC_POSICAO_LOGO_CHAT = :PSCH,
                 MRVC_IMAGEM_LOGO = :LG,
                 MRVC_IMAGEM_LOGO_APONTADOR = :LGAPT,
                 MRVC_IMAGEM_CHAT = :IMGCH,
                 MRVC_IMAGEM_CHAT_COLORIDO = : IMGCHCL                                 
                 WHERE ID_MARCA_VEICULO = '${idMa}'                
                `
              , [descricao,posLogChat,logo,logoApont,imagemChat,imagemChatColor], {
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
                SEQ_MRVC.NEXTVAL,:DESCRIC,:POSLOGCHAT,:LOGO,:LOGOAPONT,:IMAGEMCHAT,:IMAGEMCHATCOLOR
               
              )           
              
              `,
              [descricao,posLogChat,logo,logoApont,imagemChat,imagemChatColor],
              {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true
              });
            res.send("sucesso").status(200).end();      

         
          }
          if(fs.existsSync("./uploads/logo.png")){
            fs.unlinkSync('./uploads/logo.png');          
            fs.unlinkSync('./uploads/logos.png');            
           }
          
           if(fs.existsSync("./uploads/logoApont.png")){
            fs.unlinkSync('./uploads/logoApont.png');
            fs.unlinkSync('./uploads/logoAponts.png');
         
           }
           if(fs.existsSync("./uploads/imagemChat.png")){
            fs.unlinkSync('./uploads/imagemChat.png');     
            fs.unlinkSync('./uploads/imagemChats.png');       
           }
           if(fs.existsSync("./uploads/imagemChatColor.png")){
            fs.unlinkSync('./uploads/imagemChatColor.png');
            fs.unlinkSync('./uploads/imagemChatColors.png');
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