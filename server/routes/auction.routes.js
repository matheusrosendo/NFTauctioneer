module.exports = (app) => {
    const auctions = require("../controllers/auction.controller.js");
  
    var router = require("express").Router();
  
    // Create a new record
    router.post("/", auctions.create);
  
    // Retrieve all records
    router.get("/", auctions.findAll);
 
    // Retrieve a single record
    router.get("/:id", auctions.findOne);
  
    // Update a record 
    router.put("/:id", auctions.update);
  
    // Delete a record
    router.delete("/:id", auctions.delete);
    
    app.use('/api/auction/auction', router);
  };