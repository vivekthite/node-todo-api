const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');

const id1 = new ObjectID();
const id2 = new ObjectID();
 
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
            .get('/todos/'+id1.toHexString())
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
