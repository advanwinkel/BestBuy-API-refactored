// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.
const Sequelize = require('sequelize');

module.exports = function (app) {
  const sequelizeClient = app.get('sequelizeClient');
  const products = sequelizeClient.define('products', {
    name: {
      type: Sequelize.STRING
    },
    type: {
      type: Sequelize.STRING
    },
    price: {
      type: Sequelize.DECIMAL
    },
    upc: {
      type: Sequelize.STRING
    },
    shipping: {
      type: Sequelize.DECIMAL
    },
    description: {
      type: Sequelize.STRING
    },
    manufacturer: {
      type: Sequelize.STRING
    },
    model: {
      type: Sequelize.STRING
    },
    url: {
      type: Sequelize.STRING
    },
    image: {
      type: Sequelize.STRING
    }
  }, {
    hooks: {
      beforeCount(options) {
        options.raw = true;
      }
    }
  });

  products.associate = function (models) { // eslint-disable-line no-unused-vars
    // Define associations here
    // See http://docs.sequelizejs.com/en/latest/docs/associations/
    products.belongsToMany(models.categories, {through: 'productcategory', as: 'categories'});
  };

  return products;
};
