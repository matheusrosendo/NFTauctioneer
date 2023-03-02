module.exports = (sequelize: any, Sequelize: any) => {
    const bid = sequelize.define("bid", {
      tx: {
        type: Sequelize.STRING
      },
      blockchainIndex: {
        type: Sequelize.INTEGER
      }
    });
  
    return bid;
  };