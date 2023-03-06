import { task} from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers"
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export default 
task("custom-collection-deploy", "##### Deploys a NFTcollection contract as specified account #####")
.addParam("account", "The account's sequence ID")
.setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {

  //get user data by the address informed
  let userApiUrl = `${process.env.API_URL}/user/${taskArgs.account}`
  await axios({
    method: 'get', 
    url: userApiUrl
  }).then(async (response)=>{

    //verify if user was found in database
    let userAddress = response.data.address;
    if(userAddress){
      //get accounts from provider
      const accounts = await hre.ethers.getSigners();

      //deploy smart contract
      const producNFTfactory = await hre.ethers.getContractFactory("NFTcollection");
      const NFTcollectionInstance = await producNFTfactory.connect(accounts[taskArgs.account]).deploy();
      let result = await NFTcollectionInstance.deployed();
      let tx = result.deployTransaction.hash;
      console.log(`##### blockchain: NFTcollection contract deployed at ${NFTcollectionInstance.address} by account ${userAddress} #####` );
      console.log(`##### blockchain: Tx hash = ${tx}`);

      //insert in database the deployed contract
      await axios({
        method: 'post',
        url: `${process.env.API_URL}/NFTcollection`,
        data: {
          "address": NFTcollectionInstance.address,
          "tx": tx,
          "userId": taskArgs.account
        }
      }).then((response)=>{
        console.log(`##### database: NFTcollection registered in the database #####` );
        console.log(response.data);
      }), (error: any)=>{
        console.log(`Error ${error}`)
      }
    } else {
      console.log(`Error: user not found for API = ${userApiUrl}, try run task custom-init-users first!`)
    }

  }), (error: any)=>{
    console.log(`Error ${error}`)
  } 
  
});
