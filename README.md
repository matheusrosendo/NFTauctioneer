# NFTauctioneer

### Install mysql in a docker container

Install docker:    
https://docs.docker.com/desktop/install/windows-install/  
Pull the Docker Image for MySQL    
`sudo docker pull mysql/mysql-server:latest`  
Verify if image was stored correctly  
`sudo docker images`  
Deploy and Start the MySQL Container  
`docker run -p 13306:3306 --name auctionNFT -e MYSQL_ROOT_PASSWORD=root -d mysql:latest`
Install mysql client
`apt-get install mysql-client`
Log into mysql using client shell
`mysql --host=127.0.0.1 --port=13306 -u root -p`
create new schema
`create schema db_auctionNFT;`
