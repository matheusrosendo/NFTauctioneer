import { string } from "hardhat/internal/core/params/argumentTypes";

import dbConfig from "../config/db.config";
const Sequelize = require("sequelize");
const sequelize = new Sequelize(dbConfig.DB, dbConfig.USER, dbConfig.PASSWORD, {
  host: dbConfig.HOST,
  port: dbConfig.PORT,
  dialect: dbConfig.dialect,
  operatorsAliases: 0,

  pool: {
    max: dbConfig.pool.max,
    min: dbConfig.pool.min,
    acquire: dbConfig.pool.acquire,
    idle: dbConfig.pool.idle
  }
});
 
const db = {
  Sequelize: Sequelize, 
  sequelize: sequelize,
  user: require("./user.model")(sequelize, Sequelize),
  auctionManager: require("./auctionManager.model")(sequelize, Sequelize),
  auction: require("./auction.model")(sequelize, Sequelize),
  mintedNFT: require("./mintedNFT.model")(sequelize, Sequelize),
  NFTcollection: require("./NFTcollection.model")(sequelize, Sequelize),
  bid: require("./bid.model")(sequelize, Sequelize),
};

//set cardinality
db.user.hasMany(db.NFTcollection);
db.NFTcollection.belongsTo(db.user);
db.user.hasMany(db.bid);
db.bid.belongsTo(db.user);
db.auction.hasMany(db.bid);
db.bid.belongsTo(db.auction);
db.mintedNFT.hasMany(db.auction);
db.auction.belongsTo(db.mintedNFT);
db.NFTcollection.hasMany(db.mintedNFT);
db.mintedNFT.belongsTo(db.NFTcollection);
db.auctionManager.hasMany(db.auction);
db.auction.belongsTo(db.auctionManager);
db.user.hasMany(db.auctionManager);
db.auctionManager.belongsTo(db.user);



export default db;