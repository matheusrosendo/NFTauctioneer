const Util = require('commonutils');
import { task} from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers"
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

module.exports = 
task("custom-minted-info", "##### Uri info of an token on NFTcollection #####")
.addParam("minted", "Minted Token database Id")

.setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {

  //get MintedNFT data
  let mintedNFTApiUrl = `${process.env.API_URL}/mintedNFT/${taskArgs.minted}`
  await axios({
    method: 'get', 
    url: mintedNFTApiUrl
  }).then(async (response)=>{
    const mintedNFTId = response.data.id;
    const blockchainTokenId =  response.data.blockchainTokenId;
    const NFTcollectionaddress = response.data.NFTcollection.address;
    
    if(Util.verifyValidInputs([mintedNFTId, blockchainTokenId, NFTcollectionaddress])){
      
      //mint token on NFTcollection smart contract
      const NFTcollectionInstance = await hre.ethers.getContractAt("NFTcollection", NFTcollectionaddress);
      let tokenURI = await NFTcollectionInstance.tokenURI(blockchainTokenId);
      let tokenOwner = await NFTcollectionInstance.ownerOf(blockchainTokenId);
      console.log(`\n##### blockchain: NFT Info : #####` );
      console.log(`##### NFT collection address: ${NFTcollectionaddress} #####` );
      console.log(`##### NFT Uri: ${tokenURI} #####` );
      console.log(`##### NFT owner: ${tokenOwner} #####` );

    } else {
      console.log(`Error: mintedNFT not found for API = ${mintedNFTApiUrl} !`)
    }

  }), (error: any)=>{
    console.log(`Error ${error} quering ${mintedNFTApiUrl}`)
  } 

    

  
});
