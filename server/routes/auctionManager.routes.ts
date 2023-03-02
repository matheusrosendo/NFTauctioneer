export default (app: any) => {
    const auctionManager = require("../controllers/auctionManager.controller");
  
    var router = require("express").Router();
  
    // Create a new record
    router.post("/", auctionManager.create);
  
    // Retrieve all records
    router.get("/", auctionManager.findAll);
 
    // Retrieve a single record
    router.get("/:id", auctionManager.findOne);
  
    // Update a record 
    router.put("/:id", auctionManager.update);
  
    // Delete a record
    router.delete("/:id", auctionManager.delete);
    
    app.use('/api/auction/auctionManager', router);
  };