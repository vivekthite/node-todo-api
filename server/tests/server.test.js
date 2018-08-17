const expect = require('expect');
const request = require('supertest');

const {app} = require('../server');
const {Todo} = require('../models/todo');


beforeEach((done) => {
    Todo.remove({}).then(() => done());

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
                Todo.find({}).then((todos) => {
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
                    expect(todos.length).toBe(0);                    
                    done();
                }).catch((err) => done(err));
            });
    });
});
