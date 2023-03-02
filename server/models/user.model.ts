module.exports = (sequelize: any, Sequelize: any) => {
    const user = sequelize.define("user", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: false,
        primaryKey: true,
      },
      address: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      admin: {
        type: Sequelize.BOOLEAN
      }
    });
  
    return user;
  };