const express = require('express');
const subTaskController = require('../../controllers/v1/sub_task');
const middlewares = require('../../middlewares');

const router = express.Router();

router.get(
  '/get_all_sub_tasks/:task_id',
  middlewares.authToken,
  subTaskController.getAllSubTasks
);
router.post(
  '/create/:task_id',
  middlewares.authToken,
  subTaskController.createSubTask
);
router.patch(
  '/:sub_task_id',
  middlewares.authToken,
  subTaskController.updateSubTask
);
router.delete(
  '/:sub_task_id',
  middlewares.authToken,
  subTaskController.deleteSubTask
);

module.exports = router;
