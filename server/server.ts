
import * as dotenv from "dotenv";
dotenv.config();
import promiseApp from "./app";
import logger from "./logger";

// set port, listen for requests
const PORT = process.env.APP_PORT || 8080;
promiseApp.then((app:any)=>{
  app.listen(PORT, () => {
    logger.info(`Server is running on port ${PORT}.`);
  })
}).catch((error:any)=>{
  logger.error(`Error: ${error}.`);
});


