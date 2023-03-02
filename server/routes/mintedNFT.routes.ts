export default (app: any) => {
    const mintedNFTs = require("../controllers/mintedNFT.controller");
  
    var router = require("express").Router();
  
    // Create a new record
    router.post("/", mintedNFTs.create);
  
    // Retrieve all records
    router.get("/", mintedNFTs.findAll);
 
    // Retrieve a single record
    router.get("/:id", mintedNFTs.findOne);
  
    // Update a record 
    router.put("/:id", mintedNFTs.update);
  
    // Delete a record
    router.delete("/:id", mintedNFTs.delete);
    
    app.use('/api/auction/mintedNFT', router);
  };