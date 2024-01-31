const { sequelize } = require('../../db/models');
const Repository = require('../../repository');
const { TASK_STATUS } = require('../../utils/enums');
const logger = require('../../utils/logger');
const { DB_TABLES } = require('../../utils/modelEnums');

const updateStatus = async ({ task_id }) => {
  const t = await sequelize.transaction();
  try {
    const [completedCount, completedCountErr] = await Repository.count({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        task_id,
        status: true,
      },
      t,
    });
    if (completedCountErr) {
      await t.rollback();
      return [null, completedCountErr];
    }
    const [allCount, allCountErr] = await Repository.count({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        task_id,
      },
      t,
    });
    if (allCountErr) {
      await t.rollback();
      return [null, allCountErr];
    }
    let status = '';
    if (allCount === completedCount) {
      status = TASK_STATUS.DONE;
    } else if (completedCount > 0) {
      status = TASK_STATUS.IN_PROGRESS;
    }
    const [updateTask, updateErr] = await Repository.update({
      tableName: DB_TABLES.TASK,
      query: {
        id: task_id,
      },
      updateObject: {
        status,
      },
      t,
    });

    if (updateErr) {
      await t.rollback();
      return [null, updateErr];
    }
    await t.commit();
    return [status, null];
  } catch (err) {
    logger.error(`Error while updating status ${err.message}`);
    return [null, err.message];
  }
};

module.exports = updateStatus;
