const { STRING } = require("sequelize");

module.exports = (sequelize: any, Sequelize: any) => {
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