module.exports = (sequelize, Sequelize) => {
    const auction = sequelize.define("auctionManager", {
      address: {
        type: Sequelize.STRING
      },
      tx: {
        type: Sequelize.STRING
      }
    });
  
    return auction;
  };