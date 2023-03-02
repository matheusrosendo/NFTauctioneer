const Files = require("jsonfilemanager");
const Util = require('commonutils');
import { task} from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers"
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

module.exports = 
task("custom-create-user", "##### Create User in database #####")
.addParam("address", "User account address")
.addParam("description", "User account description")
.addParam("id", "User account id")
.setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
  console.log(`####### creating user args ${taskArgs.address} ${taskArgs.description}`)
  
  //simulate a request made by the frontend
  await axios({
    method: 'post',
    url: 'http://localhost:8080/api/auction/user',
    data: {
      "id": taskArgs.id,
      "address": taskArgs.address,
      "description": taskArgs.description,
      "admin": 0
    }
  }).then((response)=>{
    console.log(response.data);
  }), (error: any)=>{
    console.log(`Error ${error}`)
  }
  
  
});
