//SPDX-License-Identifier: MIT
//@author Matheus Rosendo

pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "./INFTcollection.sol";


contract AuctionManager is Ownable {
    //////////////////// Used Libraries ////////////////////
    using Counters for Counters.Counter;    

    //////////////////// END Used Libraries ////////////////////

    //////////////////// Storage Variables ////////////////////
    //default config variables
    uint BID_MIN_INCREASING_PERCENTAGE;
    uint MAX_BIDS_PER_AUCTION;
    uint AUCTION_DURATION_IN_DAYS;
    uint CONTRACT_OWNER_PERCENTAGE_COMMISSION_BPS; //using base points to avoids precision problems

    Counters.Counter private auctionCounter;
    
    struct Bid {
        address payable bidder;
        uint amount;
    }
    struct NFT{
        address contractAddress;
        uint tokenId;
    }
    struct Auction {
        uint floorPrice;
        address payable seller;
        NFT product;
        uint openTimestamp;
        uint closeTimestamp;
        mapping(uint => Bid) bidList;
        uint currentBidIndex;
        bool finished;
        uint commissionReceived;
    }

    mapping(uint => Auction) private auctionList;
    //////////////////// END Storage Variables ////////////////////

    //////////////////// Events ////////////////////////
    event AuctionCreated(address userAddress, uint auctionIndex, uint openTimestamp, uint closeTimestamp);
    event AuctionBidded(address userAddress, uint auctionIndex, uint bidIndex, address bidder, uint amount);
    event NFTdeposited(address userAddress, address NFTcontract, uint NFTtokenId, address from, address to);
    event NFTwithdrawn(address userAddress, address NFTcontract, uint NFTtokenId, address from, address to);
    //////////////////// END Events ////////////////////
    
    //////////////////// Modifiers ////////////////////
    modifier validIndex(uint indexAuction){
        require (indexAuction < auctionCounter.current(), "index auction not found!");
        _;
    }
    modifier auctionUnfinished (uint indexAuction){
        require(!auctionList[indexAuction].finished, "this auction is already finished!");
        _;
    }
    //////////////////// END Modifiers ////////////////////

    constructor(uint auctionDuration, uint maxBids, uint bidIncreasePercent, uint ownerCommission){
        AUCTION_DURATION_IN_DAYS = auctionDuration;
        MAX_BIDS_PER_AUCTION = maxBids; 
        BID_MIN_INCREASING_PERCENTAGE = bidIncreasePercent;
        CONTRACT_OWNER_PERCENTAGE_COMMISSION_BPS = ownerCommission; //150bps is 1,5 percent
    } 

    //////////////////// Internal Functions ////////////////////
    function _transferNFT(address tokenAddress, uint tokenId, address from, address to) internal {
        NFT memory product = NFT(tokenAddress, tokenId);

        INFTcollection(product.contractAddress).transferFrom(
            from,
            to,
            product.tokenId
        );
        if(to == address(this)) {
            emit NFTdeposited (msg.sender, product.contractAddress, product.tokenId, from, to);
        } else if (from == address(this)) {
            emit NFTwithdrawn (msg.sender, product.contractAddress, product.tokenId, from, to);
        } else {
            revert("unexpected error regarding current NFT ownership, NFT could not be transfered!");
        }

    }

    /** 
     * verify if auction is not finished, limit of bids per auction is not reachead yet and if current time is between open and close time
     * @param {uint} indexAuction: auction index
     * 
     */
    function _isAuctionRunning(uint indexAuction) internal view validIndex(indexAuction) returns (bool){
        if(!auctionList[indexAuction].finished){        
            if (auctionList[indexAuction].currentBidIndex < MAX_BIDS_PER_AUCTION){
                if(block.timestamp <= auctionList[indexAuction].closeTimestamp){
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    /**
     * Auction can be settle only if number of bids limit was reached or closing time is passed
     */
    function _isAuctionReadyToSettle(uint indexAuction) internal view validIndex(indexAuction) returns (bool){
        if (auctionList[indexAuction].currentBidIndex >= MAX_BIDS_PER_AUCTION || block.timestamp >= auctionList[indexAuction].closeTimestamp){
           return true;
        } else {
            return false;
        }
    }

    function _getNFTtokenURI(uint indexAuction) internal view validIndex(indexAuction) returns (string memory){
        return INFTcollection(auctionList[indexAuction].product.contractAddress).tokenURI(auctionList[indexAuction].product.tokenId);
    }

    /**
     * As a bid is assured to be greater than previous one, the best bid will be always the last in the list (currentBidIndex - 1).
     */
    function _getWinnerBid(uint indexAuction) internal view validIndex(indexAuction) returns (Bid memory){
        return auctionList[indexAuction].bidList[auctionList[indexAuction].currentBidIndex - 1];
    }
    
    

    /** 
     * verify if amount sent by bidder is greater than 0, at least equal to current winning bid amount + BID_MIN_INCREASING_PERCENTAGE
     * @param {uint} indexAuction: auction index
     * 
     */
    function _isBidPriceValid(uint indexAuction) internal view returns (bool){
        if (msg.value > 0){  
            //if it is not the first bid      
            if(auctionList[indexAuction].currentBidIndex > 0){
                uint bidMinAmount = (_getWinnerBid(indexAuction).amount *
                    (100 + BID_MIN_INCREASING_PERCENTAGE)) / 100;
                return (msg.value >= bidMinAmount);
            } else {
                //here it is the first bid, so it verifies to be equal or greater than floor price
                if(msg.value >= auctionList[indexAuction].floorPrice){
                    return true;
                } else {
                    return false;
                }                
            }
        } else {
            return false;
        }
    }

    function _calculatePercentage(uint amount, uint bps) internal pure returns (uint){  
        return amount * bps / 10_000;
    } 
    //////////////////// END Internal Functions ////////////////////


    //////////////////// Public Functions ////////////////////
    /**
     * Open an auction for the informad NFT at a floorPrice
     */
    function openAuction(address NFTcontractAddress, uint NFTtokenId, uint floorPrice) public {
        {
        NFT memory newNFTforAuction = NFT(NFTcontractAddress, NFTtokenId);

        //deposit seller NFT to this contract 
        _transferNFT(NFTcontractAddress, NFTtokenId, msg.sender, address(this));

        Auction storage newAuction = auctionList[auctionCounter.current()];
        newAuction.product = newNFTforAuction;
        newAuction.floorPrice = floorPrice;
        newAuction.seller = payable(msg.sender);
        newAuction.openTimestamp = block.timestamp;
        newAuction.closeTimestamp = block.timestamp + (AUCTION_DURATION_IN_DAYS * 1 days);
        
        emit AuctionCreated(msg.sender, auctionCounter.current(), newAuction.openTimestamp, newAuction.closeTimestamp);
        auctionCounter.increment();
        }
    }
    
    /**
     * Bid an auction with sent amount by the user
     */
    function bidAuction(uint indexAuction) public payable validIndex(indexAuction) auctionUnfinished(indexAuction) {
        require(_isAuctionRunning(indexAuction), "this auction is not running anymore!");
        require(_isBidPriceValid(indexAuction), "your bid is inferior to minimum amount required for this auction!");
        //add the new bid in the list of the auction bids
        Bid memory newBid = Bid(payable(msg.sender), msg.value);
        auctionList[indexAuction].bidList[auctionList[indexAuction].currentBidIndex] = newBid;
        
        emit AuctionBidded(msg.sender, indexAuction, auctionList[indexAuction].currentBidIndex, newBid.bidder, newBid.amount);

        //increment bid index of the auction
        auctionList[indexAuction].currentBidIndex++; 
    }  

 
     /**
     * Send NFT to the auction winner, send not winning bids amounts back to bidders, and winning bid amount to seller  
     * PS: The access to this function was set to public on purpose. 
     * Thus the first most interested part (winner bidder, looser bidder or seller) pays the gas fees   
     * 
     */
    function settleAuction (uint indexAuction) validIndex(indexAuction) auctionUnfinished(indexAuction) public {
        require (_isAuctionReadyToSettle(indexAuction), "this auction cannot be settle yet!");
        
        //verify if any bids happenned, if none sends back NFT to seller
        if(auctionList[indexAuction].currentBidIndex == 0) {
             //transfer the NFT back to seller
            _transferNFT(
                auctionList[indexAuction].product.contractAddress,
                auctionList[indexAuction].product.tokenId,
                address(this),
                auctionList[indexAuction].seller
            );
        } else {
             //transfer the NFT to the winner
            _transferNFT(
                auctionList[indexAuction].product.contractAddress,
                auctionList[indexAuction].product.tokenId,
                address(this),
                _getWinnerBid(indexAuction).bidder
            );

            //transfer commition for the contract owner
            uint commissionAmount = _calculatePercentage(_getWinnerBid(indexAuction).amount, CONTRACT_OWNER_PERCENTAGE_COMMISSION_BPS);
            payable(owner()).transfer(commissionAmount);
            auctionList[indexAuction].commissionReceived = commissionAmount;

            //transfer the winner bid amount to NFT seller discounted by platform commition
            auctionList[indexAuction].seller.transfer(_getWinnerBid(indexAuction).amount - commissionAmount);

            //transfer to looser bidders their money back
            for (uint i = 0; i < auctionList[indexAuction].currentBidIndex - 1; i++){
                auctionList[indexAuction].bidList[i].bidder.transfer(
                    auctionList[indexAuction].bidList[i].amount
                );                                
            }
        }
        auctionList[indexAuction].finished = true;    
    } 

    /**
     * Public function to verify if an Auction is ready to settle
     */
    function isAuctionReadyToSettle (uint indexAuction) public view returns(bool, string memory) {
        string memory reason;
        bool readyToSettle = false;
        if (!auctionList[indexAuction].finished){
            if (_isAuctionReadyToSettle(indexAuction)){
                readyToSettle = true;
                reason = "auction ready to settle!";
            } else {
                reason = "this auction cannot be settle yet!";
            }
        } else {
            reason = "informed auction is already finished!";
        }        
        return (readyToSettle, reason);  
    }   

    /**
     * Public getters function 
     */
    function getCurrentAuctionIndex() public view returns(uint){
        return auctionCounter.current();
    }
    function getAuctionInfo(uint indexAuction) public view validIndex(indexAuction) returns (address, string memory, uint, uint, uint, bool) {
        
        return (
            auctionList[indexAuction].seller,
            _getNFTtokenURI(indexAuction),
            auctionList[indexAuction].floorPrice, 
            auctionList[indexAuction].currentBidIndex,
            auctionList[indexAuction].commissionReceived,
            auctionList[indexAuction].finished
        );
    
    }
    function getWinnerBidOfAuction(uint indexAuction) public view validIndex(indexAuction) returns(address, uint) {
        Bid memory winnerBid = _getWinnerBid(indexAuction);
        return (winnerBid.bidder, winnerBid.amount);
    }
    function getBidOfAuction(uint indexAuction, uint indexBid) public view validIndex(indexAuction) returns(address, uint) {
        require(auctionList[indexAuction].currentBidIndex > indexBid, "Bid index not found for this auction!");
        Bid memory bid = auctionList[indexAuction].bidList[indexBid];
        return (bid.bidder, bid.amount);
    }
    function getBalance() public view returns (uint) {
        return address(this).balance;
    }
    function getAuctionTime(uint indexAuction) public view validIndex(indexAuction) returns (address, uint, uint, uint) {
        return (
            auctionList[indexAuction].seller,
             auctionList[indexAuction].openTimestamp,
            auctionList[indexAuction].closeTimestamp,
            block.timestamp 
        );  
    }
    function getConfigParameters(uint indexAuction) public view validIndex(indexAuction) returns (uint, uint, uint, uint) {    
        return (
            BID_MIN_INCREASING_PERCENTAGE,
            MAX_BIDS_PER_AUCTION,
            AUCTION_DURATION_IN_DAYS,
            CONTRACT_OWNER_PERCENTAGE_COMMISSION_BPS
        );    
    }
    //////////////////// END Public Functions ////////////////////
}