//may be used to populate database in the first execution
const util = require("commonutils");
const axios = require("axios");

module.exports = async () =>{
    if(util.parseBool(process.env.DB_INIT_POPULATE)){
        
    }
}