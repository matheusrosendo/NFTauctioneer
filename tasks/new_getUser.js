const Files = require("jsonfilemanager");
const Util = require('commonutils');
const axios = require("axios");

require("dotenv").config({path: ".env"});

module.exports = 
task("custom-get-user", "##### Get User data using axios #####")
.addParam("address", "The user account's address")
.setAction(async (taskArgs, hre) => {
   
  await axios({
    method: 'get', 
    url: `http://localhost:8080/api/auction/user?keyword=${taskArgs.address}`
  }).then((response)=>{
    console.log(response.data);
  }), (error)=>{
    console.log(`Error ${error}`)
  }

});
