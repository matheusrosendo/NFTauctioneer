const Util = require('commonutils');
const axios = require("axios");
require("dotenv").config({path: ".env"});

module.exports = 
task("custom-minted-info", "##### Uri info of an token on NFTcollection #####")
.addParam("minted", "Minted Token database Id")

.setAction(async (taskArgs, hre) => {

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

  }), (error)=>{
    console.log(`Error ${error} quering ${mintedNFTApiUrl}`)
  } 

    

  
});
