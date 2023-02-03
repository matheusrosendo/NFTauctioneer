const Files = require("jsonfilemanager");
const Util = require('commonutils');
const axios = require("axios");

require("dotenv").config({path: ".env"});

module.exports = 
task("custom-create-user", "##### Create User in database #####")
.addParam("address", "User account address")
.addParam("description", "User account description")
.addParam("id", "User account id")
.setAction(async (taskArgs, hre) => {
  console.log(`####### creating user args ${taskArgs.address} ${taskArgs.description}`)
  
  //simulate a request made by the frontend
  await axios({
    method: 'post',
    url: 'http://localhost:8080/api/auction/user',
    data: {
      "id": taskArgs.id,
      "address": taskArgs.address,
      "description": taskArgs.description,
      "admin": 0
    }
  }).then((response)=>{
    console.log(response.data);
  }), (error)=>{
    console.log(`Error ${error}`)
  }
  
  
});
