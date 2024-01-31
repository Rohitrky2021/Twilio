const cron = require('node-cron');
const Repository = require('../repository');
const { DB_TABLES } = require('../utils/modelEnums');
const { TASK_STATUS } = require('../utils/enums');
const { Op } = require('sequelize');
const twilioService = require('../services/twilio');
const globalEvents = require('../events');

var due_calls = cron.schedule('0 0 * * * *', async () => {
  //find all tasks whose due_date is passed and are still in TODO
  const [dueTasks, _] = await Repository.fetchAll({
    tableName: DB_TABLES.TASK,
    query: {
      status: TASK_STATUS.TODO,
      due_date: {
        [Op.lt]: Date.now(),
      },
    },
    include: {
      [DB_TABLES.USER]: { attributes: ['name', 'phone_number', 'priority'] },
    },
  });

  //sorting the task according to user priority
  dueTasks.sort((a, b) => {
    return a.User.priority - b.User.priority;
  });

  let i = 0;
  await twilioService.voice.createCall({
    to: dueTasks[i].User.phone_number,
  });
  i++;

  //current person didn't picked the call
  globalEvents.on('status:no-answer', async (data) => {
    if (i < dueTasks.length) {
      await twilioService.voice.createCall({
        to: dueTasks[i].User.phone_number,
      });
      i++;
    }
  });

  //current person picked the call hence stop working further
  globalEvents.on('status:in-progress', (data) => {
    //basically task is over
  });
});

module.exports = due_calls;
