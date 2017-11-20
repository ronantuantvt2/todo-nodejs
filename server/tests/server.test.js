const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

beforeEach((done) => {
   Todo.remove({}).then(() => done());
});

describe('POST /api/todos', () => {
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
                expect(todos.length).toBe(1);
                expect(todos[0].todo).toBe(todo);
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
               expect(todos.length).toBe(0);
               done();
           }).catch((e) => done(e));
         })
    });
});