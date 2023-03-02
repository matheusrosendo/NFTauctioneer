import { expect } from "chai";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";


describe("Auction Use Case -> Happy Path Unit Test \n  Actors: \n    Contract Owner: Account 0 \n    Bidders: Account 1, 2, 3\n    Seller: Account 4", function () {
  
  //deploys AuctionManager contract as account 0
  async function fixtureDeployAuctionManager() {
    const auctionManagerfactory = await ethers.getContractFactory("AuctionManager");
    const accounts = await ethers.getSigners();
    
    let auctionDuration = parseInt(process.env.AUCTION_DURATION_IN_DAYS ?? '0');
    let maxBids = parseInt(process.env.MAX_BIDS_PER_AUCTION ?? '0');
    let bidIncreasePercent = parseInt(process.env.BID_MIN_INCREASING_PERCENTAGE ?? '0');
    let ownerCommission = parseInt(process.env.CONTRACT_OWNER_PERCENTAGE_COMMISSION_BPS ?? '0');
    const auctionManagerInstance = await auctionManagerfactory.deploy(auctionDuration, maxBids, bidIncreasePercent, ownerCommission);
    await auctionManagerInstance.deployed();
    return { auctionManagerInstance, accounts};
  }

  //deploys NFTcollection contract as account 4 
  async function fixtureDeployNFTcollectionasAccount4() {
    let { auctionManagerInstance, accounts} = await fixtureDeployAuctionManager();
    const NFTcollectionfactory = await ethers.getContractFactory("NFTcollection");
    const NFTcollectioninstance = await NFTcollectionfactory.connect(accounts[4]).deploy();
    await NFTcollectioninstance.deployed();
    return { auctionManagerInstance, NFTcollectioninstance, accounts};
  }

  //mint a token as account 4
  async function fixtureMintTokenAsAccount4(){
    let { auctionManagerInstance, NFTcollectioninstance, accounts} = await fixtureDeployNFTcollectionasAccount4();
    await NFTcollectioninstance.connect(accounts[4]).safeMint(accounts[4].address, "product 0");
    return {auctionManagerInstance, NFTcollectioninstance, accounts};
  }

  //set approval on ProducNFT to ManagerAuction be able to transfer the just created token
  async function fixtureSetApprovalToActionManagerAsAccount4(){
    let {auctionManagerInstance, NFTcollectioninstance, accounts} = await fixtureMintTokenAsAccount4();
    await NFTcollectioninstance.approve(auctionManagerInstance.address, 0);
    return {auctionManagerInstance, NFTcollectioninstance, accounts};
  }
  
  //create an Auction for the minted token
  async function fixtureOpenAuctionAsAccount4(){
    let {auctionManagerInstance, NFTcollectioninstance, accounts} = await fixtureSetApprovalToActionManagerAsAccount4();
    await auctionManagerInstance.connect(accounts[4]).openAuction(NFTcollectioninstance.address, 0, "10000000000000000000");
    return {auctionManagerInstance, NFTcollectioninstance, accounts};
  }

  //bid auction as account 1, 2 and 3
  async function fixtureBidAuctionAsSeveralAccounts(){
    let {auctionManagerInstance, NFTcollectioninstance, accounts} = await fixtureOpenAuctionAsAccount4();
    await auctionManagerInstance.connect(accounts[1]).bidAuction(0,{value: "10000000000000000000"});
    await auctionManagerInstance.connect(accounts[2]).bidAuction(0,{value: "15000000000000000000"});
    await auctionManagerInstance.connect(accounts[3]).bidAuction(0,{value: "20000000000000000000"});
    return {auctionManagerInstance, NFTcollectioninstance, accounts};
  }

  //settle Auction 
  async function fixtureSettleAuctionAsAccount3(){
    let {auctionManagerInstance, NFTcollectioninstance, accounts} = await fixtureBidAuctionAsSeveralAccounts();
    
    //get balances before settle
    let account0preBalance = await ethers.provider.getBalance(accounts[0].address);
    let account1preBalance = await ethers.provider.getBalance(accounts[1].address);
    let account2preBalance = await ethers.provider.getBalance(accounts[2].address);
    let account3preBalance = await ethers.provider.getBalance(accounts[3].address);
    let account4preBalance = await ethers.provider.getBalance(accounts[4].address);
    let accountsPreBalances = [account0preBalance, account1preBalance, account2preBalance, account3preBalance, account4preBalance];
    
    //realize settle
    await auctionManagerInstance.connect(accounts[3]).settleAuction(0);

    //get balances after settle
    let account0posBalance = await ethers.provider.getBalance(accounts[0].address);
    let account1posBalance = await ethers.provider.getBalance(accounts[1].address);
    let account2posBalance = await ethers.provider.getBalance(accounts[2].address);
    let account3posBalance = await ethers.provider.getBalance(accounts[3].address);
    let account4posBalance = await ethers.provider.getBalance(accounts[4].address);
    let accountsPosBalances = [account0posBalance, account1posBalance, account2posBalance, account3posBalance, account4posBalance];
    

    return {auctionManagerInstance, NFTcollectioninstance, accounts, accountsPreBalances, accountsPosBalances};
  }
    
  
  it("be able to deploy a new AuctionManager contract as account 0", async function () {
    const {auctionManagerInstance, accounts} = await loadFixture(fixtureDeployAuctionManager);

    expect(await auctionManagerInstance.owner()).to.equal(accounts[0].address);
  });


  it("be able to deploy a new NFTcollection contract as account 4", async function () {
    const {auctionManagerInstance, NFTcollectioninstance, accounts}  = await loadFixture(fixtureDeployNFTcollectionasAccount4);
    
    expect(await NFTcollectioninstance.owner()).to.equal(accounts[4].address);
  });

  
  it("be able to mint a token on NFTcollection contract as account 4", async function () {
    const {auctionManagerInstance, NFTcollectioninstance, accounts}  = await loadFixture(fixtureMintTokenAsAccount4);
    
    expect(await NFTcollectioninstance.ownerOf(0)).to.equal(accounts[4].address);
  });


  it("be able as account 4 to set approval of the minted token to the AuctionManager contract", async function () {
    const {auctionManagerInstance, NFTcollectioninstance, accounts}  = await loadFixture(fixtureSetApprovalToActionManagerAsAccount4);

    expect(await NFTcollectioninstance.getApproved(0)).to.equal(auctionManagerInstance.address);
  });


  it("be able as account 4 to create an auction in the AuctionManager contract for the just minted token", async function () {
    const {auctionManagerInstance, NFTcollectioninstance, accounts}  = await loadFixture(fixtureOpenAuctionAsAccount4);

    expect(await auctionManagerInstance.getCurrentAuctionIndex()).to.equal(1);
  });


  it("be able accounts 1 2 and 3 to bid 10ETH, 15ETH and 20ETH the just created auction", async function () {
    const {auctionManagerInstance, NFTcollectioninstance, accounts}  = await loadFixture(fixtureBidAuctionAsSeveralAccounts);
    const [winnerBidAddress, winnerBidOffer] = await auctionManagerInstance.getWinnerBidOfAuction(0);
    
    expect(winnerBidAddress).to.equal(accounts[3].address);
    expect(Number(winnerBidOffer)).to.equal(Number("20000000000000000000"));
  });

  it("be able any account to settle auction and verify settlement", async function () {
    const {auctionManagerInstance, NFTcollectioninstance, accounts, accountsPreBalances, accountsPosBalances}  = await loadFixture(fixtureSettleAuctionAsAccount3);
    
    //verify if auction was finished
    const auctionInfo = await auctionManagerInstance.getAuctionInfo(0);
    expect(auctionInfo[auctionInfo.length-1]).to.equal(true);

    //verify if NFT was properly transfered to the winner
    const [winnerBidAddress, winnerBidOffer] = await auctionManagerInstance.getWinnerBidOfAuction(0);
    expect(await NFTcollectioninstance.ownerOf(0)).to.equal(winnerBidAddress);

    //verify if owner of the contract (account 0) received its commission
    let ownerAmountReceived = ethers.BigNumber.from(accountsPosBalances[0]).sub(accountsPreBalances[0]);
    expect(auctionInfo[auctionInfo.length-2]).to.equal(ownerAmountReceived);

    //verify if seller received the winner bid offer (bidder offer - comission)
    let sellerAmountReceived = ethers.BigNumber.from(accountsPosBalances[4]).sub(accountsPreBalances[4]);
    let bidWinnerOfferMinusCommission = ethers.BigNumber.from(winnerBidOffer).sub(ownerAmountReceived);
    expect(sellerAmountReceived).to.equal(bidWinnerOfferMinusCommission);
    
    //verify if amounts were properly returned to loser bidders (accounts 1 and 2)
    let account1AmountReceived = ethers.BigNumber.from(accountsPosBalances[1]).sub(accountsPreBalances[1]);
    const [account1BidAddress, account1BidOffer] = await auctionManagerInstance.getBidOfAuction(0, 0);
    expect(account1AmountReceived).to.equal(account1BidOffer);
    let account2AmountReceived = ethers.BigNumber.from(accountsPosBalances[2]).sub(accountsPreBalances[2]);
    const [account2BidAddress, account2BidOffer] = await auctionManagerInstance.getBidOfAuction(0, 1);
    expect(account2AmountReceived).to.equal(account2BidOffer);

  });

  
  
});