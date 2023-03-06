const Files = require("jsonfilemanager");
const Util = require('commonutils');
import { task} from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers"
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export default 
task("custom-init-users", "##### Create one admin address (first one) and populate database with the other address #####")
.setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
  
  const accounts = await hre.ethers.getSigners();
  let promiseUser = accounts.map(async (account, index) =>{
    let admin = 0;
    if(index == 0){
      admin = 1;
    }
    return await axios({
      method: 'post',
      url: `${process.env.API_URL}/user`,
      data: {
        "id": `${index}`,
        "address": account.address,
        "description": `signed accounts from Ganache: account id ${index}`,
        "admin": admin
      }
    }).then((response)=>{
      console.log(response.data);
      return response.data;
    }), (error: any)=>{
      console.log(`Error ${error}`)
      return error;
    }
  })  
  await Promise.all(promiseUser);
});
