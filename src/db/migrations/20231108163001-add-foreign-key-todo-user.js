'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('todos', {
      fields: ['user_id'],
      type: 'foreign key',
      name: 'todos_user_id_foreign_key',
      references: {
        table: 'users',
        field: 'id',
      },
      onDelete: 'RESTRICT', // Set the desired onDelete behavior
      onUpdate: 'RESTRICT', // Set the desired onUpdate behavior
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('todos', 'todos_user_id_foreign_key');
  }
};
