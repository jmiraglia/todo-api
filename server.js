var express = require('express');
var app = express();
var PORT = process.env.PORT || 3000;
var todos = [{
        id: 1,
        description: 'Meet mom for lunch',
        completed: false
    },
    {
        id: 2,
        description: 'Go to market',
        completed: false
    },
    {
        id: 3,
        description: 'Take the dog for a walk',
        completed: true
    }
];


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

app.listen(PORT, function(){
   console.log('Express server listening on port ' + PORT);
});