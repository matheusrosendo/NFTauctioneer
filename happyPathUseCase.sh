#!/bin/bash
STEP=0

printf "\n\n##### STEP %d: initiate users" $STEP
STEP=$((STEP+1))
npx hardhat custom-init-users

printf "\n\n##### STEP %d: deploy AuctionManager Smart Contract" $STEP
STEP=$((STEP+1))
npx hardhat custom-init-deploy

printf "\n\n##### STEP %d: deploy CollectionNFT Smart Contract" $STEP
STEP=$((STEP+1))
npx hardhat custom-collection-deploy --account 4

printf "\n\n##### STEP %d: mint NFT from CollectionNFT Smart Contract " $STEP
STEP=$((STEP+1))
npx hardhat custom-mintNFT --account 4 --collection 1 --uri product0

printf "\n\n##### STEP %d: check ownership of the NFT created. Owner should be Account 4 address " $STEP
STEP=$((STEP+1))
npx hardhat custom-minted-info --minted 1

printf "\n\n##### STEP %d: approve AuctionManager to transfer informed NFT " $STEP
STEP=$((STEP+1))
npx hardhat custom-approve --account 4 --manager 1  --minted 1

printf "\n\n##### STEP %d: open Auction on AuctionManager setting up 10 eth as the floor price " $STEP
STEP=$((STEP+1))
npx hardhat custom-auction-open --account 4  --manager 1 --minted 1 --floor 10

printf "\n\n##### STEP %d: make the bids with accounts 1, 2 and 3 offering 10, 15, 20 ETH respectively: " $STEP
STEP=$((STEP+1))
npx hardhat custom-auction-bid --account 1 --auction 1 --offer 10
npx hardhat custom-auction-bid --account 2 --auction 1 --offer 15
npx hardhat custom-auction-bid --account 3 --auction 1 --offer 20

printf "\n\n##### STEP %d: check up balances before settle. AuctionManager contract should have 45 ETH " $STEP
STEP=$((STEP+1))
npx hardhat custom-balances --manager 1

printf "\n\n##### STEP %d: check ownership of the NFT before settle. Owner should be AuctionManager address " $STEP
STEP=$((STEP+1))
npx hardhat custom-minted-info --minted 1

printf "\n\n##### STEP %d: settle auction " $STEP
STEP=$((STEP+1))
npx hardhat custom-auction-settle --account 4 --auction 1

printf "\n\n##### STEP %d: check up balances after settle " $STEP
STEP=$((STEP+1))
npx hardhat custom-balances --manager 1


printf "\n\n##### STEP %d: check ownership of the NFT after settle. Owner now should be the account 3 " $STEP
STEP=$((STEP+1))
npx hardhat custom-minted-info --minted 1