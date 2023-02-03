const Util = require('commonutils');
const axios = require("axios");
require("dotenv").config({path: ".env"});

module.exports = 
task("custom-auction-settle", "##### Settle Auction on Auction Manager as specified account #####")
.addParam("account", "The user account's sequence ID")
.addParam("auction", "Auction ID")

.setAction(async (taskArgs, hre) => {

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
              
      //get Auction data
      let auctionApiUrl = `${process.env.API_URL}/auction/${taskArgs.auction}`
      await axios({
        method: 'get', 
        url: auctionApiUrl
      }).then(async (response)=>{
        const auctionId = response.data.id;
        const auctionBlockchainIndex = response.data.blockchainIndex;
        const NFTcollectionAddress = response.data.mintedNFT.NFTcollection.address;
        const auctionManagerId = response.data.auctionManager.id;
        const auctionManagerAddress = response.data.auctionManager.address;
        
        if(Util.verifyValidInputs([auctionId, auctionBlockchainIndex, NFTcollectionAddress, auctionManagerId, auctionManagerAddress])){
                  
          //Settle Auction       
          const auctionManagerInstance = await hre.ethers.getContractAt("AuctionManager", auctionManagerAddress);
          let currentAuctionIndex = await auctionManagerInstance.connect(accounts[taskArgs.account]).getCurrentAuctionIndex(); 
          if(currentAuctionIndex > 0 && auctionBlockchainIndex < currentAuctionIndex){
            
            //verify if Auction is ready to settle
            const isAuctionReadyToSettle = await auctionManagerInstance.connect(accounts[taskArgs.account]).isAuctionReadyToSettle(auctionBlockchainIndex); 
            if(isAuctionReadyToSettle[0]){
              let result = await auctionManagerInstance.connect(accounts[taskArgs.account]).settleAuction(auctionBlockchainIndex);
        
              //show events and transaction hash
              const receipt = await result.wait();
              for (const event of receipt.events) {
                if(event.event){
                  console.log(`##### blockchain: Event ${event.event} emited with args ${event.args} #####`);
                }      
              }
              let tx = result.hash;    
              console.log(`##### blockchain: Auction settle done on AuctionManager, tx: ${tx} #####` );
              
              //update record in database 
              /* await axios({
                method: 'post',
                url: `${process.env.API_URL}/bid`,
                data: {
                  "tx": tx,
                  "userId": taskArgs.account,
                  "auctionId": taskArgs.auction,
                  "blockchainIndex": bidBlockchainIndex
                }
              }).then((response)=>{
                console.log(`##### database: Bid registered in the database #####` );
                console.log(response.data);
              }), (error)=>{
                console.log(`Error ${error}`)
              } */
            } else {
              console.log(`##### blockchain: this auction cannot be settled yet! ####`);
            }
            
          } else {
            console.log(`##### blockchain error: informed auction blockchain index = ${auctionBlockchainIndex} | current auction manager index = ${currentAuctionIndex} `);
          }
        } else {
          console.log(`Error quering ${auctionApiUrl} invalid data ${JSON.stringify(response.data)}`)
        }
    
      }), (error)=>{
        console.log(`Error ${error} quering ${auctionApiUrl}`)
      } 

    } else {
      console.log(`Error: user not found for API = ${userApiUrl}, try run task custom-init-users first!`)
    }

  }), (error)=>{
    console.log(`Error ${error}`)
  }
  
});
