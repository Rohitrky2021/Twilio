const express = require('express');
const taskController = require('../../controllers/v1/task');
const middlewares = require('../../middlewares');

const router = express.Router();

router.post(
  '/get_all_tasks',
  middlewares.authToken,
  taskController.getAllTasks
);
router.post('/create', middlewares.authToken, taskController.createTask);
router.patch('/:task_id', middlewares.authToken, taskController.updateTask);
router.delete('/:task_id', middlewares.authToken, taskController.deleteTask);

module.exports = router;
