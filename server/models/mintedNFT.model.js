module.exports = (sequelize, Sequelize) => {
    const mintedNFT = sequelize.define("mintedNFT", {
      tx: {
        type: Sequelize.STRING
      },
      blockchainTokenId: {
        type: Sequelize.INTEGER
      }
    });
  
    return mintedNFT;
  };