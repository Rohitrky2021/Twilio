const { sequelize } = require('../../../db/models');
const Repository = require('../../../repository');
const { TASK_STATUS } = require('../../../utils/enums');
const logger = require('../../../utils/logger');
const { DB_TABLES } = require('../../../utils/modelEnums');
const {
  unprocessableEntityResponse,
  serverErrorResponse,
  successResponse,
  createdSuccessResponse,
} = require('../../../utils/response');

const createTask = async (req, res) => {
  try {
    const { title, description, due_date } = req.body;
    if (!title)
      return unprocessableEntityResponse(
        res,
        'Please provide a title for task'
      );

    if (!due_date)
      return unprocessableEntityResponse(
        res,
        'Please provide a proper due date'
      );

    const { id } = req.user;
    const [task, taskErr] = await Repository.create({
      tableName: DB_TABLES.TASK,
      createObject: {
        title,
        description,
        due_date,
        user_id: id,
      },
    });

    if (taskErr) return serverErrorResponse(res, 'Erorr while creating task');

    return createdSuccessResponse(res, 'Task created successfuly', task);
  } catch (err) {
    logger.error(`Error in creating task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};
const getAllTasks = async (req, res) => {
  try {
    const { id } = req.user;
    const { priority, due_date, page, limit } = req.body;

    const extraparams = {};
    if (priority) extraparams.priority = priority;
    if (due_date) extraparams.due_date = due_date;

    const [tasks, tasksErr] = await Repository.fetchAll({
      tableName: DB_TABLES.TASK,
      query: { user_id: id, deleted_at: null, ...extraparams },
      extras: {
        offset: (page - 1) * limit,
        limit,
      },
    });

    if (tasksErr) return serverErrorResponse(res, tasksErr);

    return successResponse(res, 'Tasks Fetched successfuly', tasks);
  } catch (err) {
    logger.error(`Error while fetching all tasks ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const updateTask = async (req, res) => {
  try {
    const { task_id } = req.params;
    const { status, due_date } = req.body;

    let updateObject = {};
    if (status) updateObject.status = status;
    if (due_date) updateObject.due_date = due_date;

    const [updatedTask, updateErr] = await Repository.update({
      tableName: DB_TABLES.TASK,
      query: {
        id: task_id,
      },
      updateObject: updateObject,
    });

    if (updateErr) return serverErrorResponse(res, 'Error while updating task');

    return successResponse(res, 'Task updated successfuly', updatedTask);
  } catch (err) {
    logger.error(`Error in updating task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const deleteTask = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    //soft deletion
    const { task_id } = req.params;

    const [_, updateErr] = await Repository.update({
      tableName: DB_TABLES.TASK,
      query: {
        id: task_id,
      },
      updateObject: {
        deleted_at: Date.now(),
        status: TASK_STATUS.DONE,
      },
      t,
    });
    if (updateErr) {
      await t.rollback();
      return serverErrorResponse(res, 'Error while deleting a tasks');
    }

    const [updateSubTasksCount, updateSubTaskErr] = await Repository.update({
      tableName: DB_TABLES.SUB_TASK,
      query: {
        task_id,
      },
      updateObject: {
        deleted_at: Date.now(),
      },
      t,
    });
    if (updateSubTaskErr) {
      await t.rollback();
      return serverErrorResponse(res, 'Error while deleting subtasks');
    }
    await t.commit();
    return successResponse(res, 'Task Deleted Successfuly');
  } catch (err) {
    logger.error(`Error while deleting task ${err.message}`);
    return serverErrorResponse(res, err.message);
  }
};

const taskController = {
  createTask,
  getAllTasks,
  updateTask,
  deleteTask,
};

module.exports = taskController;
