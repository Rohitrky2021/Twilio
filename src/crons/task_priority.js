const cron = require('node-cron');
const Repository = require('../repository');

var task_priority_cron = cron.schedule(
  '0 0 * * * *',
  async () => {
    await Repository.runRawUpdateQuery({
      rawQuery: `UPDATE task SET priority = 
        CASE
            WHEN DATE(due_date) = CURRENT_DATE THEN 0
            WHEN DATE(due_date) BETWEEN CURRENT_DATE + INTERVAL 1 DAY AND CURRENT_DATE + INTERVAL 2 DAY THEN 1
            WHEN DATE(due_date) BETWEEN CURRENT_DATE + INTERVAL 3 DAY AND CURRENT_DATE + INTERVAL 4 DAY THEN 2
            WHEN DATE(due_date) > CURRENT_DATE + INTERVAL 4 DAY THEN 3
        END`,
    });
  },
  {
    scheduled: false,
  }
);

module.exports = task_priority_cron;
