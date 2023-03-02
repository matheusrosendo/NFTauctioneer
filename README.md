# NFT auctioneer
An Auction Manager for ERC721 based NFTs using Solidity, NodeJs / Express API and Mysql database.

![GitHub](https://img.shields.io/github/license/matheusrosendo/NFTauctioneer)
![GitHub repo size](https://img.shields.io/github/repo-size/matheusrosendo/NFTauctioneer)


> Disclaimer: this project is not ready to production, the idea here is to serve as study and starting point base to create a new NFT project, like a marketplace for example. 


## Overview 
It uses Hardhat Taks to interact with Node APIs responsible for comunicating with the Mysql database to keep track of all "user" actions. These Tasks simulate API calls that could be made by the frontend (not implemented here). That is why all communcation between Hardhat Tasks and the backend was made by http requests using the Axios library.
In order to ease testing and make interactions without implementing a frontend, a local Ganache blockchain was used and the "users" address are generated from the mnemonic informed in the .secret file. This way, whenever 0 is passed as --account parameter in a Hardhat Task, it means the first derived account from mnemonic will sign that transaction. 


### Tech Stack
```
* Typescript
* Solidity 
* Hardhat
* Node.js
* Express
* Mysql / Docker
* Sequelizer 
* Ethers.js 
* Jest / Supertest
* solidity-coverage / chai
* Ganache 
* Pino Logger
```

### Folder structure 
```
* contracts: smart contracts
* images: pictures used in this readme file
* tasks: user actions 
* test: unit tests 
* server: all backend components 
```

### Database diagram 
![alt text](https://github.com/matheusrosendo/NFTauctioneer/blob/main/images/mysqlAuctionDb.png)


## Prerequisites


#### Recomended setup 
```
* Ubuntu 22.04.1 LTS within WSL
* Windows 10 Home 21H2
* Node v18.12.1
* Npm 8.19.2
* Mysql 5,7
* Docker Desktop 4.15.0
```

### Install Mysql in a Docker container 
> If you have Mysql already installed and dont want to install Docker, just create new schema and setup .env accordly. Otherwise:

Install docker in your SO: https://docs.docker.com/desktop/install/windows-install/    
Pull the Docker Image for MySQL    
`sudo docker pull mysql/mysql-server:latest`  
Verify if image was stored correctly  
`sudo docker images`  
Deploy and Start the MySQL Container   
`docker run -p 13306:3306 --name auctionNFT -e MYSQL_ROOT_PASSWORD=root -d mysql:latest`  
Install Mysql client  
`sudo apt-get install mysql-client`  
Log into Mysql using client shell, type 'root' as password when prompted  
`mysql --host=127.0.0.1 --port=13306 -u root -p`  
Once inside mysql shell prompt (mysql>), create new schema  
`create schema db_auctionNFT;`  
 
### Setup API and Ganache Blockchain
* Clone this repository: `git clone git@github.com:matheusrosendo/NFTauctioneer.git`
* Enter NFTauctioneer folder and install dependencies: `npm install`
* In the project main folder type `code .` to open Visual Studo Code
* Rename .env_RENAME to .env
* Rename .secret_RENAME to .env
* Create a fresh new account on metamask (recomended), copy mnemonic and paste it on .secret file

Open a new terminal and start Ganache Local Blockchain replacing MNEMONIC by .secret content:  
`ganache-cli -m 'MNEMONIC'`

Verify if container is running
`docker ps`

If it is not running, start the container
`docker start auctionNFT`

## Unit Tests
It was developed two types of unit tests: the ones focused on testing the AuctionManager Smart Contract using Hardhat and Chai, located in the `test` folder; and the ones focused on testing the API endpoits using Jest and Supertest, located in the `server/backendTests` folder.

### Jest Unit Tests / Coverage (API tests)
To execute Jest Unit tests:  
`npx jest --detectOpenHandles --runInBand`
To execute Jest coverage tests:   
`npx jest --detectOpenHandles --runInBand --coverage `  

### Hardhat Unit Tests / Coverage (Smart Contract tests)
To execute hardhat unit tests:   
`npx hardhat test --network hardhat`  
To execute hardhat unit tests with solidity-coverage:  
`npx hardhat coverage --network hardhat`  
the result will be in a created folder called `coverage`. Open coverage/index.html to see the results, something like:

### Smart Contracts Test Coverage Results 
![alt text](https://github.com/matheusrosendo/NFTauctioneer/blob/main/images/testCoverage.png)
> PS: those tests are using the local hardhat network because hardhat helpers used in the tests don't work with Ganache or public testnets.


## Happy Path Use Case
Open another terminal window and start the backend. It will setup database deploying all tables from scratch using Sequelizer. It will also start Express server running the API with all endpoints:  
`npm start`    

Open another terminal window and execute all steps of the Happy Path Use Case (This use case simulates an entire auciton since minting NFT until setling down the auction). Details of each step is contained and comented in the bash script file happyPathUseCase.sh: 
`sh happyPathUseCase.sh`  

It is expected all steps executed with success with the following final results:
* Account 4 receives the bid amount offered by account 3 minus owner commission
* Account 0 (owner) receives a small commission by the sale
* Accounts 1 and 2 receive their money back
* Account 3 receives the NFT


All records serialized in database can be verified calling the following API endpoints:
* http://localhost:8080/api/auction/user/
* http://localhost:8080/api/auction/auctionManager/ 
* http://localhost:8080/api/auction/auction/ 
* http://localhost:8080/api/auction/bid/ 
* http://localhost:8080/api/auction/NFTcollection/ 
* http://localhost:8080/api/auction/mintedNFT/ 

The complete API endpoints domentation was published using Postman and can be seen here:
https://documenter.getpostman.com/view/25047000/2s8ZDeUesc


## Logs 
It was implemented Pino logger to save log files named by the currrent minute and saved in the server/logs folder 
