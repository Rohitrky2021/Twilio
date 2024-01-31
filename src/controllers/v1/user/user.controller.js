const Repository = require('../../../repository');
const logger = require('../../../utils/logger');
const { DB_TABLES } = require('../../../utils/modelEnums');
const {
  successResponse,
  serverErrorResponse,
  unprocessableEntityResponse,
  createdSuccessResponse,
} = require('../../../utils/response');

const createUser = async (req, res) => {
  try {
    const { name, phone_number, password } = req.body;

    if (!name || !phone_number || !password)
      return unprocessableEntityResponse(res, 'Please send proper values');

    const [user, userErr] = await Repository.create({
      tableName: DB_TABLES.USER,
      createObject: {
        name,
        phone_number,
        password,
      },
    });

    if (userErr) return serverErrorResponse(res, userErr);

    return createdSuccessResponse(res, 'Successfuly created user', user);
  } catch (err) {
    logger.error(`Error in creating user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const getUser = async (req, res) => {
  try {
    delete req.user.password;
    delete req.user.created_at;
    delete req.user.updated_at;
    return successResponse(res, 'User fetched Successfuly', req.user);
  } catch (err) {
    logger.error(`Error in creating user ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

module.exports = {
  createUser,
  getUser,
};
