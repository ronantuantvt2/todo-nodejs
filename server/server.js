const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');

var {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var app = express();
var {authenticate} = require('./middleware/authenticate');

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
        res.send(doc);
    }, (error) => {       
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


// User

// POST /users
app.post('/api/users', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']);
    var user = new User(body);
    
    user.save().then((userDoc) => {        
        return user.generateAuthToken();        
    }).then((token) => {        
        res.header('x-auth', token).send(user);
    }).catch((e) => {
        //console.log(e);
        res.status(400).send(e);
    });
    //return res.send(user);
});



app.get('/api/users/me', authenticate, (req, res) => {
    res.send(req.user);
});

// POST users/login
app.post('/api/users/login', (req, res) => {
    var body = _.pick(req.body, ['email', 'password']) ;
    
    User.findByCredential(body.email, body.password).then((user) => {
        return user.generateAuthToken().then((token) => {
           res.header('x-auth', token).send(user); 
        });
    }).catch((e) => {
        res.status(401).send();
    });    
});

// DELETE users/me/token
app.delete('/api/users/me/token', authenticate, (req, res) => {
    req.user.removeToken(req.token).then(function() {
        res.status(200).send();
    }, function(error) {
        res.status(400).send();
    });
});

var port = 3000;
app.listen(port, () => {
   console.log(`Server is running on port ${port} `);
});

module.exports = {app};