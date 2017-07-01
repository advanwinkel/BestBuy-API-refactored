'use strict';

const globalHooks = require('../../hooks');
var validateSchema = require('../../hooks/validate-schema');
var categorySchema = require('./schema');

module.exports = {
  before: {
    all: [],
    find: [includeAssociatedModels, globalHooks.allowNull(), globalHooks.wildcardsInLike()],
    get: [includeAssociatedModels],
    create: [globalHooks.errorIfReadonly, validateSchema(categorySchema)],
    update: [globalHooks.errorIfReadonly, validateSchema(categorySchema)],
    patch: [globalHooks.errorIfReadonly],
    remove: [globalHooks.errorIfReadonly]
  },

  after: {
    all: [],
    find: [filterParentsFromFind],
    get: [filterParentsFromGet],
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
  if (hook.params.query.$select) return; // if selecting specific columns, do not include
 
  hook.params.sequelize = {
    distinct: true, // must set this in order to get correct total count
    raw: false,
    include: [
      {
        model: hook.service.Model,
        as: 'subCats'
      },
      {
        model: hook.service.Model,
        as: 'catPath'
      }      ],
    exclude: 'subCategories'
  };
}

function filterParentsFromFind (hook) {
  if (hook.params.query.$select) return;

  hook.result.data = hook.result.data.map(d => {
    d = d.toJSON();
    d.subCategories = d.subCats.map(sub => {
      delete sub.subCategories;
      return sub;
    });
    d.categoryPath = d.catPath.map(sub => {
      delete sub.categoryPath;
      return sub;
    });
    return d;
  });
}

function filterParentsFromGet (hook) {
  if (hook.params.query.$select) return;

  if (hook.result.toJSON) hook.result = hook.result.toJSON();
  if (hook.result.subCategories) {
    hook.result.subCategories = hook.result.subCategories.map(sub => {
      delete sub.subCategories;
      return sub;
    });
  }
  if (hook.result.categoryPath) {
    hook.result.categoryPath = hook.result.categoryPath.map(sub => {
      delete sub.categoryPath;
      return sub;
    });
  }
}
