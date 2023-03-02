require("@nomicfoundation/hardhat-toolbox");
require('solidity-coverage');

//import custom taks
require("./tasks/new_createUser");
require("./tasks/new_createInitialUsers");
require("./tasks/new_deployAuctionManager");
require("./tasks/new_getUser");
require("./tasks/new_deployNFTcollection");
require("./tasks/new_mintToken");
require("./tasks/new_productNFTapprove");
require("./tasks/new_openAuction");
require("./tasks/new_bidAuction");
require("./tasks/new_balances");
require("./tasks/new_infoMintedNFT");
require("./tasks/new_settleAuction");





const fs = require("fs");
const mnemonicPhrase = fs.readFileSync(".secret").toString().trim();
//uncoment to use goerli tesnet
//const infuraProjectId = fs.readFileSync(".infura").toString().trim();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "localGanache",
  networks: {
    //uncoment to use goerli tesnet
    /* goerli: {
      url: "https://goerli.infura.io/v3/" + infuraProjectId,
      accounts: {
        mnemonic: mnemonicPhrase,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    }, */
    localGanache: {
      url: "http://127.0.0.1:8545",
      accounts: {
        mnemonic: mnemonicPhrase,
        path: "m/44'/60'/0'/0",
        initialIndex: 0,
        count: 10
      }
    }
  },
  /*uncoment below to publish verified code to etherscan  
    etherscan: {
    apiKey: fs.readFileSync(".etherscan").toString().trim(),
  }, */
  solidity: "0.8.17",
};
