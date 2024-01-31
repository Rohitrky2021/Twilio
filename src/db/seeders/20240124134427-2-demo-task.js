'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert(
      'Task',
      [
        {
          id: 1,
          title: 'Task 1',
          description: 'Test Task 1',
          user_id: 1,
          priority: 1,
          due_date: '2024-01-24T21:34:000',
          created_at: '2024-01-08T21:00:000',
          updated_at: '2024-01-08T21:00:000',
        },
        {
          id: 2,
          title: 'Task 2',
          description: 'Test Task 2',
          user_id: 1,
          priority: 1,
          due_date: '2024-01-29T14:00:000',
          created_at: '2024-01-08T21:20:000',
          updated_at: '2024-01-08T21:20:000',
        },
        {
          id: 3,
          title: 'Task 3',
          description: 'Test Task 3',
          user_id: 2,
          priority: 1,
          due_date: '2024-01-22T14:00:000',
          created_at: '2024-01-08T21:40:000',
          updated_at: '2024-01-08T21:40:000',
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Task', null, {});
  },
};
