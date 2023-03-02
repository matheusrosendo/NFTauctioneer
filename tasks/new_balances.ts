const Util = require('commonutils');
import { task} from "hardhat/config";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import "@nomiclabs/hardhat-ethers"
import axios from "axios";

module.exports = 
task("custom-balances", "Shows balances")
.addParam("manager", "Auction Manager Id")
.setAction(async (taskArgs: any, hre: HardhatRuntimeEnvironment) => {
  const accounts = await hre.ethers.getSigners();
  let balancesPromise = accounts.map(async (account, index) =>{
    const balance = await hre.ethers.provider.getBalance(account.address);
    let retStr = (`${index} ${account.address} ${hre.ethers.utils.formatEther(balance)} ETH`);
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
      const auctionManagerBalance = await hre.ethers.provider.getBalance(auctionManagerAddress);
      console.log(`AuctionManager (${auctionManagerAddress}) ${hre.ethers.utils.formatEther(auctionManagerBalance)} ETH`);
    } else {
      console.log(`Error quering ${AuctionManagerApiUrl} invalid data ${JSON.stringify(response.data)}`)
    }        
  }), (error: any)=>{
    console.log(`Error ${error} quering ${AuctionManagerApiUrl}`)
  } 

  
  
});