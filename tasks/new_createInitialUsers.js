const Files = require("jsonfilemanager");
const Util = require('commonutils');
const axios = require("axios");

require("dotenv").config({path: ".env"});

module.exports = 
task("custom-init-users", "##### Create one admin address (first one) and populate database with the other address #####")
.setAction(async (taskArgs, hre) => {
  
  const accounts = await hre.ethers.getSigners();
  let promiseUser = accounts.map(async (account, index) =>{
    let admin = 0;
    if(index == 0){
      admin = 1;
    }
    return await axios({
      method: 'post',
      url: `${process.env.API_URL}/user`,
      data: {
        "id": `${index}`,
        "address": account.address,
        "description": `signed accounts from Ganache: account id ${index}`,
        "admin": admin
      }
    }).then((response)=>{
      console.log(response.data);
      return response.data;
    }), (error)=>{
      console.log(`Error ${error}`)
      return error;
    }
  })  
  await Promise.all(promiseUser);
});
