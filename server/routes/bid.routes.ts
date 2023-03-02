export default (app: any) => {
    const bids = require("../controllers/bid.controller");
  
    var router = require("express").Router();
  
    // Create a new record
    router.post("/", bids.create);
  
    // Retrieve all records
    router.get("/", bids.findAll);
 
    // Retrieve a single record
    router.get("/:id", bids.findOne);
  
    // Update a record 
    router.put("/:id", bids.update);
  
    // Delete a record
    router.delete("/:id", bids.delete);
    
    app.use('/api/auction/bid', router);
  };