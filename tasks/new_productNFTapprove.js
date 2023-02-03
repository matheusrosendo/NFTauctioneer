const Util = require('commonutils');
const axios = require("axios");
require("dotenv").config({path: ".env"});

module.exports = 
task("custom-approve", "##### Approve AuctionManager contract to transfer a specific token of the informed NFTcollection #####")
.addParam("account", "The user account's sequence ID")
.addParam("manager", "Auction Manager ID")
.addParam("minted", "MintedNFT Id")
.setAction(async (taskArgs, hre) => {
 

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

      //get auctionManager data
      let auctionManagerApiUrl = `${process.env.API_URL}/auctionManager/${taskArgs.manager}`
      await axios({
        method: 'get', 
        url: auctionManagerApiUrl
      }).then(async (response)=>{
        const auctionManagerAddress = response.data.address;
        const auctionManagerId =  response.data.id;
        
        if(auctionManagerAddress && auctionManagerId){
          
          //get MintedNFT data
          let mintedNFTApiUrl = `${process.env.API_URL}/mintedNFT/${taskArgs.minted}`
          await axios({
            method: 'get', 
            url: mintedNFTApiUrl
          }).then(async (response)=>{
            const mintedNFTId = response.data.id;
            const blockchainTokenId =  response.data.blockchainTokenId;
            const NFTcollectionaddress = response.data.NFTcollection.address;
            console.log(response.data);
            
            if(Util.verifyValidInputs([mintedNFTId, blockchainTokenId])){
              
              
              //make approval
              const NFTcollectionInstance = await hre.ethers.getContractAt("NFTcollection", NFTcollectionaddress);
              let result = await NFTcollectionInstance.connect(accounts[taskArgs.account]).approve(auctionManagerAddress, blockchainTokenId);
              const receipt = await result.wait();                  
              //show events and transaction hash
              for (const event of receipt.events) {
                console.log(`##### blockchain: Event ${event.event} emited with args ${event.args} #####`);
              }    
              let tx = result.hash;    
              console.log(`##### blockchain: Token approved to be transfer by Auction Manager, tx: ${tx} #####` );
              

            } else {
              console.log(`Error: mintedNFT not found for API = ${mintedNFTApiUrl} !`)
            }
        
          }), (error)=>{
            console.log(`Error ${error} quering ${mintedNFTApiUrl}`)
          } 

        } else {
          console.log(`Error: auctionManager not found for API = ${auctionManagerApiUrl} !`)
        }
    
      }), (error)=>{
        console.log(`Error ${error} quering ${auctionManagerApiUrl}`)
      } 
      
    } else {
      console.log(`Error: user not found for API = ${userApiUrl}, try run task custom-init-users first!`)
    }

  }), (error)=>{
    console.log(`Error ${error}`)
  }

  
});
