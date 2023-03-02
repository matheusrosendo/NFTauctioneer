module.exports = (sequelize: any, Sequelize: any) => {
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