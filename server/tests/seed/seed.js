const {ObjectID} = require('mongodb');
const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const jwt = require('jsonwebtoken');

const todos = [{
    _id: new ObjectID(),
    todo: 'First todo'
}, {
    _id: new ObjectID(),
    todo: 'Second todo',
    completed: true,
    completedAt: 123
}];

const populateTodos = (done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done());
};

var userObjectID = new ObjectID();
var user2ObjectID = new ObjectID();
const users = [{
    _id: userObjectID,
    email: 'test@gmail.com',
    password: '123abc',
    tokens: [{
        'access': 'auth',
        'token': jwt.sign({_id: userObjectID, access: 'auth'}, 'abc123').toString()
    }]
}, {
    _id: user2ObjectID,
    email: 'test01@gmail.com',
    password: '123abc',
    tokens: [{
        'access': 'auth',
        'token': jwt.sign({_id: user2ObjectID, access: 'auth'}, 'abc123').toString()
    }]    
}];

const populateUsers = (done) => {
    User.remove({}).then(() => {
        var user1 = new User(users[0]).save();
        var user2 = new User(users[1]).save();
        return Promise.all([user1, user2])
    }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};
