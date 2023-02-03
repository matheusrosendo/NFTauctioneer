const Files = require("jsonfilemanager");
const Util = require('commonutils');
const axios = require("axios");

require("dotenv").config({path: ".env"});

module.exports = 
task("custom-init-deploy", "##### Deploy AuctionManager and save tx and address in the database #####")
.setAction(async (taskArgs, hre) => {
  
  //get user id of the owner of the contract
  const accounts = await hre.ethers.getSigners();
  let userId;
  await axios({
    method: 'get', 
    url: `${process.env.API_URL}/user?keyword=${accounts[0].address}`
  }).then(async (response)=>{

    //verify if user was found in database
    if(response.data.length > 0){
      userId = response.data[0].id;

      //deploy smart contract
      const AuctionManager = await hre.ethers.getContractFactory("AuctionManager");
      let auctionDuration = parseInt(process.env.AUCTION_DURATION_IN_DAYS);
      let maxBids = parseInt(process.env.MAX_BIDS_PER_AUCTION);
      let bidIncreasePercent = parseInt(process.env.BID_MIN_INCREASING_PERCENTAGE);
      let ownerCommission = parseInt(process.env.CONTRACT_OWNER_PERCENTAGE_COMMISSION_BPS);
      const auctionManagerInstance = await AuctionManager.connect(accounts[0]).deploy(auctionDuration, maxBids, bidIncreasePercent, ownerCommission);
      await auctionManagerInstance.deployed();
      console.log(`Deployed contract at ${auctionManagerInstance.address}`);
      console.log(`Tx hash = ${auctionManagerInstance.deployTransaction.hash}`);

      //insert in database the deployed contract
      await axios({
        method: 'post',
        url: `${process.env.API_URL}/auctionManager`,
        data: {
          "address": auctionManagerInstance.address,
          "tx": auctionManagerInstance.deployTransaction.hash,
          "userId": userId
        }
      }).then((responseAuction)=>{
        console.log(`##### database: AuctionManager registered in the database #####` );
        console.log(responseAuction.data);
      }), (error)=>{
        console.log(`Error ${error}`)
      }
    } else {
      console.log(`Error: user not found, try run task custom-init-users first!`)
    }

  }), (error)=>{
    console.log(`Error ${error}`)
  } 

  
});
