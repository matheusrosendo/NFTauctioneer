import "@nomicfoundation/hardhat-toolbox";
import 'solidity-coverage';

//import custom taks
import "./tasks/new_createUser";
import "./tasks/new_createInitialUsers";
import "./tasks/new_deployAuctionManager";
import "./tasks/new_getUser";
import "./tasks/new_deployNFTcollection";
import "./tasks/new_mintToken";
import "./tasks/new_productNFTapprove";
import "./tasks/new_openAuction";
import "./tasks/new_bidAuction";
import "./tasks/new_balances";
import "./tasks/new_infoMintedNFT";
import "./tasks/new_settleAuction";


import fs from "fs";
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
