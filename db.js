var Sequelize = require('sequelize');
var env = process.env.NODE_ENV || 'development';
var sql;
if (env === 'production') {
    sql = new Sequelize(process.env.DATABASE_URL, {
        dialect: 'postgres'
    });
} else {
    sql = new Sequelize(undefined, undefined, undefined, {
        'dialect': 'sqlite',
        'storage': __dirname + '/data/dev-todo-api.sqlite'
    });
}
var db = {};

db.todo = sql.import(__dirname + '/models/todo.js');
db.user = sql.import(__dirname + '/models/user.js');
db.sql = sql;
db.Sequelize = Sequelize;

module.exports = db;