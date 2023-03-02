//may be used to populate database in the first execution
const util = require("commonutils");
import axios from "axios";

export default async () =>{
    if(util.parseBool(process.env.DB_INIT_POPULATE)){
        //code to populate database here
    }
}