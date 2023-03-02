require("dotenv").config();

export default {  
  HOST: process.env.DB_HOST,
    PORT: process.env.DB_PORT,
    USER: process.env.DB_ROOT_USER,
    PASSWORD: process.env.DB_ROOT_PASS,
    DB: process.env.DB_NAME,
    dialect: "mysql",
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };