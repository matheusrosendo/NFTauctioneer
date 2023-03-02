module.exports = (sequelize: any, Sequelize: any) => {
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