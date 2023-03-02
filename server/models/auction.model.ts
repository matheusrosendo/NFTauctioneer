module.exports = (sequelize: any, Sequelize: any) => {
    const auction = sequelize.define("auction", {
      tx: {
        type: Sequelize.STRING
      }, 
      blockchainIndex: {
        type: Sequelize.INTEGER
      }

    });
  
    return auction;
  };