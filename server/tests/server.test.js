const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const id1 = new ObjectID().toHexString();
const id2 = new ObjectID().toHexString();
 
const todos = [
    {
        _id: id1,
        text: 'First test todo'
    },
    {
        _id: id2,
        text: 'Second test todo'
    }
];


beforeEach((done) => {
    Todo.remove({})
        .then(() => {
        return Todo.insertMany(todos);
        })
        .then(() => done())
        ;
});

describe('POST /todos' , () => {
    //todo get created when valid data is passed
    it('should create todo' , (done) => {
        var text = 'First todo from mocha test';

        request(app)
            .post('/todos')
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text)
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                //check data in mongodb
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((err) => done(err));
            });
    });

    //todo not created when invalid data is passed
    it('should not create todo when text is not passed',(done) => {       

        request(app)
            .post('/todos')
            .send({})
            .expect(500)
            /* .expect((res) => {
                expect(res.body.text).toBe(text)
            }) */
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                //check data in mongodb
                Todo.find({}).then((todos) => {
                    expect(todos.length).toBe(2);                    
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('GET /todos' , () => {
    it('should return all todos' , (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);                
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                done();
            });
    });
});

describe('GET /todos/:id' , () => {
    it('should return todo doc' , (done) => {
        request(app)
            .get('/todos/'+id1)
            .expect(200)
            .expect((res) => {                
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done)
            ;
    });

    it('should return 404 if todo not found' , (done) => {
        request(app)
            .get('/todos/'+new ObjectID().toHexString())
            .expect(404)
            .end(done)
            ;
    });

    it('should return 404 for invalid id' , (done) => {
        request(app)
            .get('/todos/'+123)
            .expect(404)
            .end(done)
            ;
    });
});

describe('DELETE /todos/:id' , () => {
    it('should delete todo' , (done) => {
        request(app)
            .delete('/todos/'+id1)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
                expect(res.body.todo._id).toBe(todos[0]._id);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(id1).then((todo) => {
                    expect(todo).toNotExist();
                }).catch((err) => done(err));
                done();
            })
            ;
    });

    it('should return 404 for invalid todo id' , (done) => {
        request(app)
            .delete('/todos/'+123)
            .expect(404)            
            .end(done)
            ;
    });

    it('should return 404 if todo not found' , (done) => {
        request(app)
            .delete('/todos/'+new ObjectID().toHexString())
            .expect(404)            
            .end(done)
            ;
    });

});
