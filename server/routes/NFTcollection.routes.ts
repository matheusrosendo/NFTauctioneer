export default (app: any) => {
    const NFTcollections = require("../controllers/NFTcollection.controller");
  
    var router = require("express").Router();
  
    // Create a new record
    router.post("/", NFTcollections.create);
  
    // Retrieve all records
    router.get("/", NFTcollections.findAll);
 
    // Retrieve a single record
    router.get("/:id", NFTcollections.findOne);
  
    // Update a record 
    router.put("/:id", NFTcollections.update);
  
    // Delete a record
    router.delete("/:id", NFTcollections.delete);
    
    app.use('/api/auction/NFTcollection', router);
  };