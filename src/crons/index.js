const due_calls = require('./due_calls');
const task_priority_cron = require('./task_priority');

const registerSchedules = () => {
  task_priority_cron.start();
  due_calls.start();
};

module.exports = registerSchedules;
