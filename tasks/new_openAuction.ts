const Util = require('commonutils');
import { task} from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers"
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

export default 
task("custom-auction-open", "##### Open Auction on Auction Manager as specified account #####")
.addParam("account", "The user account's sequence ID")
.addParam("manager", "Auction Manager ID")
.addParam("minted", "MintedNFT Id")
.addParam("floor", "Floor price in ETH")

.setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {

  //get user data by the address informed
  let userApiUrl = `${process.env.API_URL}/user/${taskArgs.account}`
  await axios({
    method: 'get', 
    url: userApiUrl
  }).then(async (response)=>{
    let userAddress = response.data.address;
    if(userAddress){
      
      //get accounts from provider
      const accounts = await hre.ethers.getSigners();
              
      //get MintedNFT data
      let mintedNFTApiUrl = `${process.env.API_URL}/mintedNFT/${taskArgs.minted}`
      await axios({
        method: 'get', 
        url: mintedNFTApiUrl
      }).then(async (response)=>{
        const mintedNFTId = response.data.id;
        const blockchainTokenId = response.data.blockchainTokenId;
        const NFTcollectionAddress = response.data.NFTcollection.address;


        if(Util.verifyValidInputs([mintedNFTId, blockchainTokenId, NFTcollectionAddress])){
          
          
              
          //get AuctionManager data
          let AuctionManagerApiUrl = `${process.env.API_URL}/AuctionManager/${taskArgs.manager}`
          await axios({
            method: 'get', 
            url: AuctionManagerApiUrl
          }).then(async (response)=>{
            const auctionManagerAddress = response.data.address;
            const auctionManagerId = response.data.id;
            if(Util.verifyValidInputs([auctionManagerAddress])){
              
              //open Auction on Auction Manager smart contract
              const auctionManagerInstance = await hre.ethers.getContractAt("AuctionManager", auctionManagerAddress);
              let weiAmount = hre.ethers.utils.parseUnits(taskArgs.floor,"ether");
              let result = await auctionManagerInstance.connect(accounts[taskArgs.account]).openAuction(NFTcollectionAddress, blockchainTokenId, weiAmount);
              
              //show events and transaction hash
              const receipt = await result.wait();
              let auctionBlockchainIndex;
              for (const event of receipt.events) {
                if(event.event){
                  console.log(`##### blockchain: Event ${event.event} emited with args ${event.args} #####`);
                }
                //get the blockchain index of the Auction created 
                if(event.event == "AuctionCreated"){
                  auctionBlockchainIndex = parseInt(event.args[1]);
                }     
              }
              let tx = result.hash;    
              console.log(`##### blockchain: Auction open on AuctionManager, tx: ${tx} #####` );
              
              //insert in database the created Auction
              await axios({
                method: 'post',
                url: `${process.env.API_URL}/auction`,
                data: {
                  "tx": tx,
                  "auctionManagerId": auctionManagerId,
                  "mintedNFTId": mintedNFTId,
                  "blockchainIndex": auctionBlockchainIndex
                }
              }).then((response)=>{
                console.log(`##### database: Auction registered in the database #####` );
                console.log(response.data);
              }), (error: any)=>{
                console.log(`Error ${error}`)
              }

            } else {
              console.log(`Error quering ${AuctionManagerApiUrl} invalid data ${JSON.stringify(response.data)}`)
            }        
          }), (error: any)=>{
            console.log(`Error ${error} quering ${AuctionManagerApiUrl}`)
          }  

        } else {
          console.log(`Error quering ${mintedNFTApiUrl} invalid data ${JSON.stringify(response.data)}`)
        }
    
      }), (error: any)=>{
        console.log(`Error ${error} quering ${mintedNFTApiUrl}`)
      } 

    } else {
      console.log(`Error: user not found for API = ${userApiUrl}, try run task custom-init-users first!`)
    }

  }), (error: any)=>{
    console.log(`Error ${error}`)
  }
  
});
