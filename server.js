var express = require('express');
var body_parser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todo_next_id = 1;

app.use(body_parser.json());

app.get('/', function (req, res) {
    res.send('Todo API Root');
});

// return all todo items
app.get('/todos', function (req, res) {
    var query_params = req.query,
        filtered_todos = todos,
        filter = {};

    if (query_params.hasOwnProperty('completed') && query_params.completed === 'true') {
        filter.completed = true;
    } else if (query_params.hasOwnProperty('completed') && query_params.completed === 'true') {
        filter.completed = false;
    }

    if (query_params.hasOwnProperty('q') && query_params.q.length > 0) {
        filtered_todos = _.filter(filtered_todos, function (todo) {
            if (todo.description.toLowerCase().indexOf(query_params.q.toLowerCase()) !== -1) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    if (filter) {
        filtered_todos = _.where(filtered_todos, filter);
    }

    res.json(filtered_todos);
});

// return a single todo item
app.get('/todos/:id', function (req, res) {
    var todo_id = parseInt(req.params.id, 10),
        matched_todo;
    // Find the requested todo by id
    matched_todo = _.findWhere(todos, {id: todo_id});

    if (matched_todo) {
        res.status(200).json(matched_todo);
    } else {
        res.status(404).json({"error": "no todo found with that id"});
    }
});

app.post('/todos', function (req, res) {
    // Only return valid fields
    var body = _.pick(req.body, 'description', 'completed');

    if (!_.isString(body.description) || !_.isBoolean(body.completed) || body.description.trim().length === 0) {
        return res.status(404).json({"error": "invalid data sent"});
    }

    body.description = body.description.trim();
    body.id = todo_next_id++;
    todos.push(body);

    res.status(200).json(body);
});

app.delete('/todos/:id', function (req, res) {
    var todo_id = parseInt(req.params.id, 10),
        matched_todo = _.findWhere(todos, {id: todo_id});

    if (matched_todo) {
        // Remove the matched_todo from array of todos
        todos = _.without(todos, matched_todo);
        res.status(200).json(matched_todo);
    } else {
        res.status(404).json({"error": "no todo found with that id"});
    }
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

app.listen(PORT, function () {
    console.log('Express server listening on port ' + PORT);
});