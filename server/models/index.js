const dbConfig = require("../config/db.config.js");
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

const db = {};

db.Sequelize = Sequelize; //library
db.sequelize = sequelize; //Object

//set models and cardinality
db.user = require("./user.model.js")(sequelize, Sequelize);
db.auctionManager = require("./auctionManager.model.js")(sequelize, Sequelize);
db.auction = require("./auction.model.js")(sequelize, Sequelize);
db.mintedNFT = require("./mintedNFT.model.js")(sequelize, Sequelize);
db.NFTcollection = require("./NFTcollection.model.js")(sequelize, Sequelize);
db.bid = require("./bid.model.js")(sequelize, Sequelize);
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




module.exports = db;