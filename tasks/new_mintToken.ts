import { task} from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers"
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

module.exports = 
task("custom-mintNFT", "##### Mint a new NFT in a NFTcollection contract as specified account #####")
.addParam("account", "The account's sequence ID")
.addParam("collection", "The NFTcollection ID")
.addParam("uri", "NFT uri")
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

      //get NFTcollection data
      let collectionApiUrl = `${process.env.API_URL}/NFTcollection/${taskArgs.collection}`
      await axios({
        method: 'get', 
        url: collectionApiUrl
      }).then(async (response)=>{
        const NFTcollectionaddress = response.data.address;
        const NFTcollectionId =  response.data.id;
        
        if(NFTcollectionaddress && NFTcollectionId){
          
          //mint token on NFTcollection smart contract
          const NFTcollectionInstance = await hre.ethers.getContractAt("NFTcollection", NFTcollectionaddress);
          let result = await NFTcollectionInstance.connect(accounts[taskArgs.account]).safeMint(userAddress, taskArgs.uri);
          //show events and transaction hash
          const receipt = await result.wait();
          let blockchainTokenId; 
          for (const event of receipt.events) {
            console.log(`##### blockchain: Event ${event.event} emited with args ${event.args} #####`);
            blockchainTokenId = event.args[2]; 
          }
          console.log(`tokenId = ${blockchainTokenId}`)
          let tx: string = result.hash;    
          console.log(`##### blockchain: Token minted on NFTcollection, tx: ${tx} #####` );

          //insert in database the minted NFT
          await axios({
            method: 'post',
            url: `${process.env.API_URL}/mintedNFT`,
            data: {
              "NFTcollectionId": NFTcollectionId,
              "tx": tx,
              "blockchainTokenId": parseInt(blockchainTokenId)
            }
          }).then((response)=>{
            console.log(`##### database: MintedNFT registered #####` );
            console.log(response.data);
          }), (error: any)=>{
            console.log(`Error ${error}`)
          }

        } else {
          console.log(`Error: NFTcollection not found for API = ${collectionApiUrl} !`)
        }
    
      }), (error: any)=>{
        console.log(`Error ${error} quering ${collectionApiUrl}`)
      } 

    } else {
      console.log(`Error: user not found for API = ${userApiUrl}, try run task custom-init-users first!`)
    }

  }), (error: any)=>{
    console.log(`Error ${error}`)
  } 
  
});
