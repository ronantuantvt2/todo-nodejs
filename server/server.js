const express = require('express');
const bodyParser = require('body-parser');

var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {
   res.send({name: 'Ronan'});
});

app.post('/api/todos', (req, res) => {
    //console.log(req.body);
    var todo = new Todo({
       todo: req.body.todo,
       completed: req.body.completed ? req.body.completed : false
    });
    todo.save().then((doc) => {
        console.log('Save todo');
        res.send(doc);
    }, (error) => {
       console.log('Unable to save todo'); 
        res.status(400).send(error);
    });
});

// Get all todos
// GET : todos
app.get('/api/todos', (req, res) => {
   Todo.find().then((todos) => {
      return res.send(todos); 
   }, (e) => {
       return res.status(400).send([]);
   });
});

// Get detail a todo
// GET: todos/:todoId
app.get('/api/todos/:todoId', (req, res) => {   
    var todoId = req.params.todoId;
    if (!ObjectID.isValid(todoId)) {
        return res.status(404).send({});
    }
    
    Todo.findById(todoId).then((todo) => {
        if (!todo) {
            return res.status(404).send({});    
        }
        return res.send(todo);
    }, (e) => {
        return res.status(400).send({});
    });
});

app.listen(3000, () => {
   console.log('Server is running on port 3000');
});

module.exports = {app};