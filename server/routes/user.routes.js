module.exports = (app) => {
    const users = require("../controllers/user.controller.js");
  
    var router = require("express").Router();
  
    // Create a new record
    router.post("/", users.create);
  
    // Retrieve all record
    router.get("/", users.findAll);
  
    // Retrieve all record
    router.get("/published", users.findAllPublished);
  
    // Retrieve a single record
    router.get("/:id", users.findOne);
  
    // Update a record 
    router.put("/:id", users.update);
  
    // Delete a record
    router.delete("/:id", users.delete);
  
    app.use('/api/auction/user', router);
  };