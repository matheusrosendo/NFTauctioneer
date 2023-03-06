const Files = require("jsonfilemanager");
const Util = require('commonutils');
import { task} from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers"
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

require("dotenv").config({path: ".env"});

export default 
task("custom-get-user", "##### Get User data using axios #####")
.addParam("address", "The user account's address")
.setAction(async (taskArgs, hre) => {
   
  await axios({
    method: 'get', 
    url: `http://localhost:8080/api/auction/user?keyword=${taskArgs.address}`
  }).then((response)=>{
    console.log(response.data);
  }), (error: any)=>{
    console.log(`Error ${error}`)
  }

});
