require("dotenv").config();
const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_CONSTRING = process.env.DB_CONSTRING;


const dbConfig = {  
    user : DB_USER,
    password : DB_PASSWORD,
    connectString : DB_CONSTRING 

   }

   module.exports = dbConfig;
