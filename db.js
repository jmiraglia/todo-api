var Sequelize = require('sequelize');
var sql = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/data/dev-todo-api.sqlite'
});
var db = {};

db.todo = sql.import(__dirname + '/models/todo.js');
db.sql = sql;
db.Sequelize = Sequelize;

module.exports = db;


