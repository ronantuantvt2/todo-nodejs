const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


describe('POST /api/todos', () => {
    beforeEach(populateTodos);
    // Success case
    it('should create todo', (done) => {
        var todo = 'Test create todo';
        
        request(app)
          .post('/api/todos')
          .send({todo})
          .expect(200)
          .expect((res) => {
            expect(res.body.todo).toBe(todo);
          })
          .end((err, res) => {
            if (err) {
                return done(err);
            }
            Todo.find().then((todos) => {
                expect(todos.length).toBe(3);
                expect(todos[2].todo).toBe(todo);
                done();
            }).catch((e) => done(e));
        })
    });  
    
    // Failed case
    it('Should not create todo', (done) => {
       request(app)
         .post('/api/todos')
         .send({})
         .expect(400)
         .end((err, res) => {
           if (err) return done(err);
           
           Todo.find().then((todos) => {
               expect(todos.length).toBe(2);
               done();
           }).catch((e) => done(e));
         })
    });
});


beforeEach(populateUsers);
/*
describe('GET api/users/me', () => {
    beforeEach(populateUsers);
    it('Should return user if authenticated', (done) => {        
       request(app) 
         .get('/api/users/me')
         .set('x-auth', users[0].tokens[0].token)
         .expect(200)
         .expect((res) => {
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
         })
         .end(done)
    });
       
    it('Shoulde return 401 if not authenticated', (done) => {
       request(app)
         .get('/api/users/me')
         .expect(401)
         .expect((res) => {
            expect(res.body).toEqual({});
         })
         .end(done)
    });    
});


describe('POST api/users', () => {      
    beforeEach(populateUsers);
    it('Should create user', (done) => {
        var email = 'test02@gmail.com';
        var password = 'abc333';
        
        request(app)
          .post('/api/users')
          .send({email, password})
          .expect(200)
          .expect((res) => {
            expect(res.header['x-auth']).toBeTruthy();
            expect(res.body._id).toBeTruthy();
            expect(res.body.email).toBe(email);
          })
          .end((err) => {
            if (err) {
                return done(err);    
            }
            User.findOne({email}).then((user) => {
                expect(user).toBeTruthy();
                // expect(user.password).toNotBe(password);
                done();
            });
          })
    });
        
    it('Should return valiation errors if request invalid', (done) => {
        var email = "abc";    
        var password = 'abc';
        
        request(app)
          .post('/api/users')
          .send({email, password})
          .expect(200)
          .end(done());
    });
        
    it ('Should not create user if email in use', (done) => {
        var email = "test@gmail.com";    
        var password = 'abc123!';
        
        request(app)
          .post('/api/users')
          .send({email, password})
          .expect(400)
          .end(done());
        
    });    
});

describe('POST /api/users/login', () => {        
    
    console.log(users);
    it ('Should login user and return token', (done) => {
       request(app)
         .post('/api/users/login')
         .send({
           email: users[1].email,
           password: users[1].password
         })
         .expect(200)        
         .expect((res) => {
             expect(res.header('x-auth')).toBeTruthy();
             expect(res.body.email).toBe(users[1].email);
         })
         .end(done())
    });                    
    
    it('Should reject invalid login', (done) => {
        request(app)   
          .post('/api/users/login')
          .send({
             email: users[1].email,
             password: users[1].password            
           })
           .expect(400)
           .end(done())
    });        
});
*/

describe('DELETE /api/users/me/token', () => {
    it('Shoulde remove token on logout', (done) => {
        request(app)
          .delete('/api/users/me/token')
          .set('x-auth', users[0].tokens[0].token)
          .expect(200)
          .end((err, res) => {
             if (err) {
                 return done(err);
             }  
            
             User.findById(users[0]._id).then((user) => {
                 expect(user.tokens.length).toBe(0);
                 done();
             }).catch((e) => done(e));
          });
    });  
});