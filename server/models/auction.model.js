module.exports = (sequelize, Sequelize) => {
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