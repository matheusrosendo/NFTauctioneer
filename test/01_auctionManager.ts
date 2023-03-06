import { expect } from "chai";
import hre from 'hardhat'
import '@nomiclabs/hardhat-ethers'
import * as dotenv from "dotenv";
dotenv.config();

describe("AuctionManager general unit test", function () {
 
  it("be able to deploy a new AuctionManager contract", async function () {
    const auctionManager = await hre.ethers.getContractFactory("AuctionManager");

    let auctionDuration = parseInt(process.env.AUCTION_DURATION_IN_DAYS!);
    let maxBids = parseInt(process.env.MAX_BIDS_PER_AUCTION!);
    let bidIncreasePercent = parseInt(process.env.BID_MIN_INCREASING_PERCENTAGE!);
    let ownerCommission = parseInt(process.env.CONTRACT_OWNER_PERCENTAGE_COMMISSION_BPS!);
    await auctionManager.deploy(auctionDuration, maxBids, bidIncreasePercent, ownerCommission);

  });
  
});
