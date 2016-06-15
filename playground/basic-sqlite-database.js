var Sequelize = require('sequelize');
var sql = new Sequelize(undefined, undefined, undefined, {
    'dialect': 'sqlite',
    'storage': __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sql.define('todo', {
    description: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
            len: [1, 255]
        }
    },
    completed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
    }
});

sql.sync({

}).then(function () {
    console.log('Everything is synced');
    //get item by id and print

    Todo.findById(2).then(function(todo){
        if(todo){
            console.log(todo.toJSON());
        } else {
            console.log('No todo found');
        }
    });

    //Todo.create({
    //    description: 'Walk the Dog',
    //    completed: false
    //}).then(function (todo) {
    //    return Todo.create({
    //        description: 'Clean office'
    //    });
    //}).then(function(){
    //    return Todo.findAll({
    //        where: {
    //            description: {
    //                $like: '%clean%'
    //            }
    //        }
    //    });
    //}).then(function(todos){
    //    if(todos){
    //        todos.forEach(function (todo){
    //            console.log(todo.toJSON());
    //        });
    //    } else {
    //        console.log('No todo found');
    //    }
    //}).catch(function(e){
    //    console.log(e);
    //});
});