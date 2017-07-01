// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const zipcodes = sequelizeClient.define('zipcodes', {
    zip: {
      type: Sequelize.STRING,
      primaryKey: true
    },
    lng: {
      type: Sequelize.DECIMAL
    },
    lat: {
      type: Sequelize.DECIMAL
    },
    city: {
      type: Sequelize.STRING
    },
    state: {
      type: Sequelize.STRING
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  zipcodes.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
  };

  return zipcodes;
};
