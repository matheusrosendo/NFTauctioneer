
require("dotenv").config();
const promiseApp = require("./app.js");
const logger = require("./logger");

// set port, listen for requests
const PORT = process.env.APP_PORT || 8080;
promiseApp.then((app)=>{
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}.`);
  })
}).catch((error)=>{
  logger.error(`Error: ${error}.`);
});


