require("@nomicfoundation/hardhat-toolbox");
require('solidity-coverage');

//import custom taks
require("./tasks/new_createUser.ts");
require("./tasks/new_createInitialUsers.ts");
require("./tasks/new_deployAuctionManager.ts");
require("./tasks/new_getUser.ts");
require("./tasks/new_deployNFTcollection.ts");
require("./tasks/new_mintToken.ts");
require("./tasks/new_productNFTapprove.ts");
require("./tasks/new_openAuction.ts");
require("./tasks/new_bidAuction.ts");
require("./tasks/new_balances.ts");
require("./tasks/new_infoMintedNFT.ts");
require("./tasks/new_settleAuction.ts");





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
