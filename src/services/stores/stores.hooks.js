const globalHooks = require('../../hooks');
var validateSchema = require('../../hooks/validate-schema');
var storeSchema = require('./schema');
var findNearby = require('../../hooks/findNearby');

module.exports = {
  before: {
    all: [],
    find: [findNearby, includeAssociatedModels, findServiceById, findServiceByName, globalHooks.allowNull(), globalHooks.wildcardsInLike()],
    get: [includeAssociatedModels],
    create: [globalHooks.errorIfReadonly, validateSchema(storeSchema)],
    update: [globalHooks.errorIfReadonly, validateSchema(storeSchema)],
    patch: [globalHooks.errorIfReadonly],
    remove: [globalHooks.errorIfReadonly]
  },

  after: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: []
  }
};

function includeAssociatedModels (hook) {
  //const createModel = require('../../models/categories.model');
  //const categoriesModel = createModel(hook.app);

  //const sequelize = hook.app.get('sequelizeClient');

  if (hook.params.query.$select) return; // if selecting specific columns, do not include
  hook.params.sequelize = {
    distinct: true, // must set this in order to get correct total count
    raw: false, // Without this Feathers-sequelize 2.x will return incorrect JSON result of the included association
    include: [{
      model: hook.app.services.services.Model, through: {attributes: []}, as: 'services'
    }]
  };
  return hook;
}

function findServiceById (hook) {
  /*
    This makes both of these work:
    /products?service[id]=abcat0208002
    /products?service.id=abcat0208002
  */
  let serviceId;
  let q = hook.params.query;
  if (q['service.id']) {
    serviceId = q['service.id'];
    delete q['service.id'];
  } else if (q.service && q.service.id) {
    serviceId = q.service.id;
    delete q.service;
  }

  if (serviceId) {
    q.id = {
      // a bit gnarly but works https://github.com/sequelize/sequelize/issues/1869
      $in: hook.service.Model.sequelize.literal(`(
        SELECT DISTINCT storeId from storeservices
        INNER JOIN services on services.id = storeservices.serviceId
        where services.id = '${serviceId}')`)
    };
  }
}

function findServiceByName (hook) {
  /*
    This makes both of these work:
    /stores?service[name]=Best+Buy+Mobile
    /stores?service.name=Best+Buy+Mobile
  */
  let serviceName;
  let q = hook.params.query;
  if (q['service.name']) {
    serviceName = q['service.name'];
    delete q['service.name'];
  } else if (q.service && q.service.name) {
    serviceName = q.service.name;
    delete q.service;
  }

  if (serviceName) {
    q.id = {
      // a bit gnarly but works https://github.com/sequelize/sequelize/issues/1869
      $in: hook.service.Model.sequelize.literal(`(
        SELECT DISTINCT storeId from storeservices
        INNER JOIN services on services.id = storeservices.serviceId
        where services.name = '${serviceName}')`)
    };
  }
}
