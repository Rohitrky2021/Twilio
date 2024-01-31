const taskHelper = require('../../../helpers/task');
const Repository = require('../../../repository');
const logger = require('../../../utils/logger');
const { DB_TABLES } = require('../../../utils/modelEnums');
const {
  serverErrorResponse,
  successResponse,
} = require('../../../utils/response');

const createSubTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const [subt, subtErr] = await Repository.create({
      tableName: DB_TABLES.SUB_TASK,
      createObject: {
        task_id,
      },
    });

    if (subtErr) return serverErrorResponse(res, subtErr);

    return successResponse(res, 'SubTask created successfuly', subt);
  } catch (err) {
    logger.error(`Error in creating task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const getAllSubTasks = async (req, res) => {
  try {
    const { task_id } = req.params;
    const [subTasks, subtasksErr] = await Repository.fetchAll({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        task_id,
        deleted_at: null,
      },
    });

    if (subtasksErr) return serverErrorResponse(res, subtasksErr);
    return successResponse(res, 'SubTasks fetched successfuly', subTasks);
  } catch (err) {
    logger.error(`Error while fetching subtasks ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const updateSubTask = async (req, res) => {
  try {
    const { sub_task_id } = req.params;
    const { status } = req.body;
    const [updateRes, updateErr] = await Repository.update({
      tableName: DB_TABLES.SUB_TASK,
      query: { id: sub_task_id },
      updateObject: {
        status,
      },
    });
    if (updateErr) return serverErrorResponse(res, updateErr);
    const [_, taskUpdateErr] = await taskHelper.updateStatus({ task_id });
    if (updateErr) return serverErrorResponse(res, taskUpdateErr);
    return successResponse(res, 'Sub Task updated successfuly', updateRes);
  } catch (err) {
    logger.error(`Error while updating Sub Task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const deleteSubTask = async (req, res) => {
  try {
    const { sub_task_id } = req.params;
    const [_, deleteErr] = await Repository.update({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        id: sub_task_id,
      },
      updateObject: {
        deleted_at: Date.now(),
      },
    });

    if (deleteErr) return serverErrorResponse(res, deleteErr);

    return successResponse(res, 'Sub Task Deleted Successfuly');
  } catch (err) {
    logger.error(`Error while deleting sub task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const subTaskController = {
  createSubTask,
  getAllSubTasks,
  updateSubTask,
  deleteSubTask,
};

module.exports = subTaskController;
