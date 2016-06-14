var express = require('express');
var body_parser = require('body-parser');

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
    for(var i=0;i<todos.length;i++){
        if(todos[i].id === todo_id){
            matched_todo = todos[i];
        }
    }

    if(matched_todo){
        res.json(matched_todo);
    } else {
        res.status(404).send();
    }
});

app.post('/todos', function(req, res){
    var body = req.body;

    if(typeof body.description === 'string'
        && typeof body.completed === 'boolean') {
        body.id = todo_next_id++;
        todos.push(body);
    } else {
        console.log('Invalid information sent POST');
    }

    res.json(body);
});

app.listen(PORT, function(){
   console.log('Express server listening on port ' + PORT);
});

// May 12th from Doug Rebeles cell phone