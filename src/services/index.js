const products = require('./products/products.service.js');
const categories = require('./categories/categories.service.js');
const stores = require('./stores/stores.service.js');
const services = require('./services/services.service.js');
module.exports = function () {
  const app = this; // eslint-disable-line no-unused-vars
  app.configure(products);
  app.configure(categories);
  app.configure(stores);
  app.configure(services);
};
