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

// Create relationship between users and todo items
db.todo.belongsTo(db.user);
db.user.hasMany(db.todo);

module.exports = db;