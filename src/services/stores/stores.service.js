// Initializes the `stores` service on path `/stores`
const createService = require('feathers-sequelize');
const createModel = require('../../models/stores.model');
const hooks = require('./stores.hooks');
const filters = require('./stores.filters');

module.exports = function () {
  const app = this;
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'stores',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/stores', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('stores');

  service.hooks(hooks);

  if (service.filter) {
    service.filter(filters);
  }
};
