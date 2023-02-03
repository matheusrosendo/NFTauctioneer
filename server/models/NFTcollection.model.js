const { STRING } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const NFTcollection = sequelize.define("NFTcollection", {
      address: {
        type: Sequelize.STRING
      },
      tx: {
        type: Sequelize.STRING
      }
    });
  
    return NFTcollection;
  };