import express from "express";
import cors from "cors";
import seeder from "./seeder";
import logger from "./logger";
import userRoute from "./routes/user.routes";
import auctionManager from "./routes/auctionManager.routes";
import NFTcollectionRoute from "./routes/NFTcollection.routes";
import mintedNFTRoute from "./routes/mintedNFT.routes";
import auctionRoute from "./routes/auction.routes";
import bidRoute from "./routes/bid.routes";
import database from "./models";
const Util = require('commonutils');

export default new Promise(async (resolve, reject)=>{
  try {
    const app = express();

    var corsOptions = {
      origin: "http://localhost:8081"
    };

    app.use(cors(corsOptions));

    //recreate database 
    database.sequelize.sync({force: Util.parseBool(process.env.DB_FORCE_RECREATE)}).then(() => {
        logger.info("Drop and re-sync db.");
        seeder();
    });

    // parse requests of content-type - application/json
    app.use(express.json());

    // parse requests of content-type - application/x-www-form-urlencoded
    app.use(express.urlencoded({ extended: true }));

    // simple route
    app.get("/", (req: any, res: any) => {
      res.json({ message: "Welcome to the NFT Auction API." });
    });

    // define routes
    userRoute(app)
    auctionManager(app)
    NFTcollectionRoute(app)
    mintedNFTRoute(app)
    auctionRoute(app)
    bidRoute(app)

    resolve(app);
  }  catch (error: any) {
    reject(error);
  }
});

    
  



