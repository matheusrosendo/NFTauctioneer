const express = require("express");
const cors = require("cors");
const seeder = require("./seeder");
const logger = require("./logger");
const userRoute = require("./routes/user.routes.js");
const auctionManager = require("./routes/auctionManager.routes.js");
const NFTcollectionRoute = require("./routes/NFTcollection.routes.js");
const mintedNFTRoute = require("./routes/mintedNFT.routes.js");
const auctionRoute = require("./routes/auction.routes.js");
const bidRoute = require("./routes/bid.routes.js");
const db = require("./models");
const Util = require("commonutils");

let promiseApp = new Promise(async (resolve, reject)=>{
  try {
    const app = express();

    var corsOptions = {
      origin: "http://localhost:8081"
    };

    app.use(cors(corsOptions));

    //recreate database 
    db.sequelize.sync({force: Util.parseBool(process.env.DB_FORCE_RECREATE)}).then(() => {
        logger.info("Drop and re-sync db.");
        seeder();
    });

    // parse requests of content-type - application/json
    app.use(express.json());

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // simple route
    app.get("/", (req, res) => {
      res.json({ message: "Welcome to Sticky Auction application." });
    });

    // define routes
    userRoute(app)
    auctionManager(app)
    NFTcollectionRoute(app)
    mintedNFTRoute(app)
    auctionRoute(app)
    bidRoute(app)

    resolve(app);
  }  catch (error) {
    reject(error);
  }
});

    
  


module.exports = promiseApp;



