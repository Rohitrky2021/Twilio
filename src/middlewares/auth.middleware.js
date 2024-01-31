const jwtHelper = require('../helpers/jwt');
const Repository = require('../repository');
const logger = require('../utils/logger');
const { DB_TABLES } = require('../utils/modelEnums');
const { unauthorizedResponse } = require('../utils/response');

const authToken = async (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (!token) return unauthorizedResponse(res, 'Unauthorized access');
    token = token.split(' ')[1];
    const decodedToken = await jwtHelper.verify(token);
    const { id } = decodedToken;
    const [user, userErr] = await Repository.fetchOne({
      tableName: DB_TABLES.USER,
      query: {
        id,
      },
    });
    if (!user || userErr)
      return unauthorizedResponse(res, 'Unauthorized access');

    req.user = user;
    next();
  } catch (err) {
    logger.error(`Unable to verify token: ${err}`);
    return unauthorizedResponse(res, 'Unauthorized access');
  }
};

module.exports = authToken;
