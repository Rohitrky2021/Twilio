// Utils
const logger = require('../utils/logger');
const { DB_MODELS } = require('../utils/modelEnums');

// Models
const { sequelize } = require('../db/models');

// Helpers and services
const JsonHelper = require('../helpers/json');
const SequelizeHelper = require('../helpers/sequelize');

const create = async ({ tableName, createObject, extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];
    const createdObject = await modelName.create(createObject, {
      transaction: t,
      ...extras,
    });

    return [JsonHelper.parse(createdObject), null];
  } catch (err) {
    if (err?.errors?.[0]?.message) {
      let msg = err.errors[0].message;
      logger.error(`Error while creating ${tableName}: ${msg}`);
      return [null, msg];
    }
    logger.error(`Error while creating ${tableName}: `, err);
    return [null, err.message];
  }
};

const bulkCreate = async ({ tableName, createObject, extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];
    const createdObjects = await modelName.bulkCreate(createObject, {
      transaction: t,
      ...extras,
    });
    return [JsonHelper.parse(createdObjects), null];
  } catch (err) {
    if (err?.errors?.[0]?.message) {
      let msg = err.errors[0].message;
      logger.error(`Error while creating ${tableName}(bulk): ${msg}`);
      return [null, msg];
    }
    logger.error(`Error while creating ${tableName}(bulk): `, err);
    return [null, err.message];
  }
};

const fetchOne = async ({ tableName, query, include = [], extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];

    let errForInclude = '';

    [include, errForInclude] = SequelizeHelper.getIncludeArray(include);

    if (errForInclude) return [null, errForInclude];
    const data = await modelName.findOne({
      where: query,
      include,
      ...extras,
      transaction: t,
    });

    return [JsonHelper.parse(data), null];
  } catch (err) {
    logger.error(`Error while fetching ${tableName}: `, err);
    return [null, err.message];
  }
};

const fetchAll = async ({ tableName, query, include = [], extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];

    let errForInclude = '';

    [include, errForInclude] = SequelizeHelper.getIncludeArray(include);

    if (errForInclude) return [null, errForInclude];

    const data = await modelName.findAll({
      where: query,
      include,
      ...extras,
      transaction: t,
    });

    return [JsonHelper.parse(data), null];
  } catch (err) {
    logger.error(`Error while fetching ${tableName}(All): `, err);
    return [null, err.message];
  }
};

const update = async ({ tableName, updateObject, query, extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];
    const data = await modelName.update(updateObject, {
      where: query,
      transaction: t,
      ...extras,
    });

    return [JsonHelper.parse(data), null];
  } catch (err) {
    if (err?.errors?.[0]?.message) {
      let msg = err.errors[0].message;
      logger.error(`Error while updating ${tableName}: ${msg}`);
      return [null, msg];
    }
    logger.error(`Error while updating ${tableName}: `, err);
    return [null, err.message];
  }
};

const destroy = async ({ tableName, query, t }) => {
  try {
    const modelName = DB_MODELS[tableName];
    const data = await modelName.destroy({
      where: query,
      transaction: t,
    });

    return [JsonHelper.parse(data), null];
  } catch (err) {
    logger.error(`Error while deleting ${tableName}: `, err);
    return [null, err.message];
  }
};

const count = async ({ tableName, query, include = [], extras, t }) => {
  try {
    const modelName = DB_MODELS[tableName];

    let errForInclude = '';

    [include, errForInclude] = SequelizeHelper.getIncludeArray(include);

    if (errForInclude) return [null, errForInclude];

    const data = await modelName.count({
      where: query,
      include,
      ...extras,
      transaction: t,
    });

    return [JsonHelper.parse(data), null];
  } catch (err) {
    logger.error(`Error while fetching count for ${tableName}: `, err);
    return [null, err.message];
  }
};
/**
 * @param {string} rawQuery - raw sql query
 * @param {sequelize.model} tableName - your base table for the raw query( should be a value from DB_MODELS )
 * @param {Object} include - json for the structure of your joins in the query (will be identical to sequelize format for include but will only contain model names)
 * @param {string} replacements - object for params you have passed in your rawQuery
 * @param {string} hasJoin - true if your query has a join else false ( default true )
 * @param {Object} extras - anything extra you want to pass other than function arguments
 * */

const runRawQuery = async ({
  rawQuery,
  tableName,
  include,
  replacements,
  hasJoin = true,
  extras = {},
}) => {
  const options = {
    include,
  };
  try {
    tableName._validateIncludedElements(options);
    let result = await sequelize.query(rawQuery, {
      raw: false,
      nest: true,
      replacements,
      model: tableName,
      hasJoin,
      mapToModel: true,
      ...options,
      ...extras,
    });
    return [result, null];
  } catch (err) {
    logger.error(`Error while executing raw query: `, err);
    return [null, err.message];
  }
};

const runRawUpdateQuery = async ({ rawQuery }) => {
  try {
    let result = await sequelize.query(rawQuery);
    return [result, null];
  } catch (err) {
    logger.error(`Error while running raw update query `, err);
    return [null, err.message];
  }
};

// (async function test() {
// let t = await sequelize.transaction();
// await fetchOne({
// tableName: DB_TABLES.LEAD,
// //updateObject: { name: 'test 123456' },
// include: {
// [DB_TABLES.LEAD_PHONE_NUMBER]: {
// order: ['type'],
// },
// //[DB_TABLES.ACCOUNT]: {
// //where: { name: 'test' },
// //},
// //[DB_TABLES.USER]: {
// //attributes: ['first_name', 'last_name'],
// //[DB_TABLES.SUB_DEPARTMENT]: {
// //attributes: ['name'],
// //},
// //},
// },
// query: { lead_id: '1' },
// //extras: { limit: 1, logging: console.log },
// t,
// });
// try {
// //throw new Error('ainvayi');
// await t.commit();
// } catch (err) {
// console.log(err);
// await t.rollback();
// }
// })();

const Repository = {
  create,
  bulkCreate,
  fetchOne,
  fetchAll,
  update,
  destroy,
  count,
  runRawQuery,
  runRawUpdateQuery,
};

module.exports = Repository;
