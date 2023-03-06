import { expect } from "chai";
import hre from 'hardhat'
import '@nomiclabs/hardhat-ethers'
import * as dotenv from "dotenv";
dotenv.config();
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("NFTcollection general unit test", function () {
  async function fixtureDeployNFTcollectionfromAccount0() {
    const NFTcollectionfactory = await hre.ethers.getContractFactory("NFTcollection");
    const accounts = await hre.ethers.getSigners();
    const NFTcollectioninstance = await NFTcollectionfactory.connect(accounts[0]).deploy();
    await NFTcollectioninstance.deployed();
    return { NFTcollectioninstance, accounts};
  }

  async function fixtureDeployNFTcollectionfromAccount1() {
    const NFTcollectionfactory = await hre.ethers.getContractFactory("NFTcollection");
    const accounts = await hre.ethers.getSigners();
    const NFTcollectioninstance = await NFTcollectionfactory.connect(accounts[1]).deploy();
    await NFTcollectioninstance.deployed();
    return { NFTcollectioninstance, accounts};
  }

  async function fixtureDeployNFTcollectionfromAccount4() {
    const NFTcollectionfactory = await hre.ethers.getContractFactory("NFTcollection");
    const accounts = await hre.ethers.getSigners();
    const NFTcollectioninstance = await NFTcollectionfactory.connect(accounts[4]).deploy();
    await NFTcollectioninstance.deployed();
    return { NFTcollectioninstance, accounts};
  }

   //deploys AuctionManager contract as account 0
   async function fixtureDeployAuctionManager() {
    const auctionManagerfactory = await hre.ethers.getContractFactory("AuctionManager");
    const accounts = await hre.ethers.getSigners();
    
    let auctionDuration = parseInt(process.env.AUCTION_DURATION_IN_DAYS ?? '0');
    let maxBids = parseInt(process.env.MAX_BIDS_PER_AUCTION ?? '0');
    let bidIncreasePercent = parseInt(process.env.BID_MIN_INCREASING_PERCENTAGE ?? '0');
    let ownerCommission = parseInt(process.env.CONTRACT_OWNER_PERCENTAGE_COMMISSION_BPS ?? '0');
    const auctionManagerInstance = await auctionManagerfactory.deploy(auctionDuration, maxBids, bidIncreasePercent, ownerCommission);

    await auctionManagerInstance.deployed();
    return { auctionManagerInstance, accounts};
  }
  
  it("be able to deploy a new NFTcollection contract and mint an NFT as account 0", async function () {   
    const {NFTcollectioninstance, accounts} = await loadFixture(fixtureDeployNFTcollectionfromAccount0);
    await NFTcollectioninstance.safeMint(accounts[0].address, "product0");

    expect(await NFTcollectioninstance.ownerOf(0)).to.equal(accounts[0].address);
  });

  it("be able to deploy a new NFTcollection contract and mint an NFT as account 1", async function () {   
    const {NFTcollectioninstance, accounts} = await loadFixture(fixtureDeployNFTcollectionfromAccount1);
    await NFTcollectioninstance.safeMint(accounts[1].address, "product0");

    expect(await NFTcollectioninstance.ownerOf(0)).to.equal(accounts[1].address);
  });

  it("be able to deploy a new NFTcollection contract, mint and burn an NFT as account 1", async function () {   
    const {NFTcollectioninstance, accounts} = await loadFixture(fixtureDeployNFTcollectionfromAccount1);
    await NFTcollectioninstance.connect(accounts[1]).safeMint(accounts[1].address, "product0");
    expect(await NFTcollectioninstance.ownerOf(0)).to.equal(accounts[1].address);
    await NFTcollectioninstance.burn(0);
    await expect(NFTcollectioninstance.ownerOf(0)).to.be.rejectedWith("ERC721: invalid token ID");

  });

  it("fail to set approval of a Token as an acccount that is not its owner", async function () {   
    const {auctionManagerInstance} = await loadFixture(fixtureDeployAuctionManager);
    const {NFTcollectioninstance, accounts} = await loadFixture(fixtureDeployNFTcollectionfromAccount4);
    await NFTcollectioninstance.connect(accounts[4]).safeMint(accounts[5].address, "product 0");
    
    await expect(NFTcollectioninstance.approve(auctionManagerInstance.address, 0))
      .to.be.rejectedWith("ERC721: approve caller is not token owner or approved for all");
  }); 

  it("be able to mint an NFT as account 4 to account 5, and as account 5 set approval of the minted token to AuctionManager contract", async function () {
    const {auctionManagerInstance} = await loadFixture(fixtureDeployAuctionManager);
    const {NFTcollectioninstance, accounts} = await loadFixture(fixtureDeployNFTcollectionfromAccount4);
    await NFTcollectioninstance.connect(accounts[4]).safeMint(accounts[5].address, "product 0");
    await NFTcollectioninstance.connect(accounts[5]).approve(auctionManagerInstance.address, 0);
    expect(await NFTcollectioninstance.getApproved(0)).to.equal(auctionManagerInstance.address);
  });
  
  
});