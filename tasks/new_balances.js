const Util = require('commonutils');
const axios = require("axios");
require("dotenv").config({path: ".env"});

module.exports = 
task("custom-balances", "Shows balances")
.addParam("manager", "Auction Manager Id")
.setAction(async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();
  let balancesPromise = accounts.map(async (account, index) =>{
    const balance = await ethers.provider.getBalance(account.address);
    let retStr = (`${index} ${account.address} ${ethers.utils.formatEther(balance)} ETH`);
    return retStr;
  });
  let balances = await Promise.all(balancesPromise);
  console.log("##### Account Balances #####");
  for (let balance of balances){
    console.log(balance);
  }

  console.log("\n##### Auction Manager Smart Contract Balances #####");  

  //get AuctionManager data
  let AuctionManagerApiUrl = `${process.env.API_URL}/AuctionManager/${taskArgs.manager}`
  await axios({
    method: 'get', 
    url: AuctionManagerApiUrl
  }).then(async (response)=>{
    const auctionManagerAddress = response.data.address;
    const auctionManagerId = response.data.id;
    if(Util.verifyValidInputs([auctionManagerAddress])){
      const auctionManagerBalance = await ethers.provider.getBalance(auctionManagerAddress);
      console.log(`AuctionManager (${auctionManagerAddress}) ${ethers.utils.formatEther(auctionManagerBalance)} ETH`);
    } else {
      console.log(`Error quering ${AuctionManagerApiUrl} invalid data ${JSON.stringify(response.data)}`)
    }        
  }), (error)=>{
    console.log(`Error ${error} quering ${AuctionManagerApiUrl}`)
  } 

  
  
});