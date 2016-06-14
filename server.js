var express = require('express');
var body_parser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todo_next_id = 1;

app.use(body_parser.json());

app.get('/', function(req, res){
    res.send('Todo API Root');
});

// return all todo items
app.get('/todos', function(req, res){
    res.json(todos);
});

// return a single todo item
app.get('/todos/:id', function(req, res){
    var todo_id = parseInt(req.params.id, 10),
        matched_todo;

    // Find the requested todo by id
    matched_todo = _.findWhere(todos, {id: todo_id});

    if(matched_todo){
        res.json(matched_todo);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function(req, res){
    // Only return valid fields
    var body = _.pick(req.body, 'description', 'completed');

    if(!_.isString(body.description) || !_.isBoolean(body.completed) || body.description.trim().length === 0){
        return res.status(400).send();
    }

    body.description = body.description.trim();
    body.id = todo_next_id++;
    todos.push(body);

    res.json(body);
});

app.listen(PORT, function(){
   console.log('Express server listening on port ' + PORT);
});