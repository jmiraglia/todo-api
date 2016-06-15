var express = require('express');
var body_parser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(body_parser.json());

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

// return all todo items
app.get('/todos', function (req, res) {
    var query = req.query,
        where = {};

    if (query.hasOwnProperty('completed') && query.completed === 'true') {
        where.completed = true;
    } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
        where.completed = false;
    }

    if (query.hasOwnProperty('q') && query.q.length > 0) {
        where.description = {$like: '%' + query.q + '%'};
    }

    db.todo
        .findAll({where: where})
        .then(function (todos) {
            res.status(200).json(todos);
        })
        .catch(function (e) {
            res.status(500).json(e);
        });
});

// return a single todo item
app.get('/todos/:id', function (req, res) {
    var todo_id = parseInt(req.params.id, 10);

    db.todo
        .findById(todo_id)
        .then(function (todo) {
            if (!!todo) {
                res.status(200).json(todo.toJSON());
            } else {
                res.status(404).json({"error": "No todo found with that ID"});
            }
        })
        .catch(function (e) {
            res.status(500).json(e);
        });
});

app.post('/todos', function (req, res) {
    // Only return valid fields
    var body = _.pick(req.body, 'description', 'completed');

    db.todo
        .create(body)
        .then(function (todo) {
            res.status(200).json(todo.toJSON());
        })
        .catch(function (e) {
            res.status(500).json(e);
        });
});

app.delete('/todos/:id', function (req, res) {
    var todo_id = parseInt(req.params.id, 10);

    db.todo
        .destroy({
            where: {
                id: todo_id
            }
        })
        .then(function(records_deleted){
            if(records_deleted === 0){
                res.status(404).json({error: "No todo with id"})
            } else {
                res.status(204).send();
            }
        })
        .catch(function(e){
            res.status(500).json(e);
        });
});

app.put('/todos/:id', function (req, res) {
    var body = _.pick(req.body, 'description', 'completed'),
        valid_attributes = {},
        todo_id = parseInt(req.params.id, 10),
        matched_todo = _.findWhere(todos, {id: todo_id});

    if (!matched_todo) {
        return res.status(404).json({"error": "no todo found with that id"});
    }

    if (body.hasOwnProperty('completed') && _.isBoolean(body.completed)) {
        valid_attributes.completed = body.completed;
    } else if (body.hasOwnProperty('completed') && !_.isBoolean(body.completed)) {
        return res.status(400).json({"error": "invalid data type for [completed]"});
    }

    if (body.hasOwnProperty('description') && _.isString(body.description) && body.description.trim().length > 0) {
        valid_attributes.description = body.description.trim();
    } else if (body.hasOwnProperty('description') && !_.isString(body.description)) {
        return res.status(400).json({"error": "invalid data type for [description]"});
    }


    // overwrite with new values
    _.extend(matched_todo, valid_attributes);

    return res.status(200).json(matched_todo);
});

db.sql.sync()
    .then(function () {
            app.listen(PORT, function () {
                console.log('Express server listening on port ' + PORT);
            });
        }
    );