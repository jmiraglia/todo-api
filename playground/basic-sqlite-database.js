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

var User = sql.define('user', {
    email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sql
    .sync({})
    .then(function () {
        console.log('Everything is synced');
        //get item by id and print

        User
            .findById(1)
            .then(function (user) {
                user
                    .getTodos({
                        where: {
                            completed: false
                        }
                    })
                    .then(function (todos) {
                        todos.forEach(function (todo) {
                            console.log(todo.toJSON());
                        });
                    });
            });

        //User
        //    .create({
        //        email: 'jmiraglia@interstateaerials.com'
        //    })
        //    .then(function () {
        //        return Todo.create({
        //            description: 'Clean yard'
        //        });
        //    })
        //    .then(function(todo){
        //        User
        //            .findById(1)
        //            .then(function(user){
        //                user.addTodo(todo);
        //            });
        //    });
    });