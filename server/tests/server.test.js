const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('../server');
const {Todo} = require('../models/todo');
const {insertTodos,todos,users,insertUsers} = require('./seed/seed');
const {User} = require('../models/user');

beforeEach(insertUsers);
beforeEach(insertTodos);

describe('POST /todos' , () => {

    it('should return 401 when x-auth token is not passed',(done) => {
        var text = 'First todo from mocha test';
        request(app)
            .post('/todos')
            .send({text})            
            .expect(401)
            .end(done);
    });

    it('should return 401 when invalid x-auth token is passed',(done) => {
        var text = 'First todo from mocha test';
        request(app)
            .post('/todos')
            .send({text}) 
            .set('x-auth', '12345')           
            .expect(401)
            .end(done);
    })

    //todo get created when valid data is passed
    it('should create todo' , (done) => {
        var text = 'First todo from mocha test';

        request(app)
            .post('/todos')
            .send({text})
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
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
                    expect(todos.length).toBe(3);                    
                    done();
                }).catch((err) => done(err));
            });
    });
});

describe('GET /todos' , () => {
    it('should return all todos' , (done) => {
        request(app)
            .get('/todos')
            .set('x-auth',users[0].tokens[0].token)
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
            .get('/todos/'+todos[0]._id)
            .set('x-auth',users[0].tokens[0].token)
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
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done)
            ;
    });

    it('should return 404 for invalid id' , (done) => {
        request(app)
            .get('/todos/'+123)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done)
            ;
    });

    it('should return 404 if it tries to fetch todo created by soemone else' , (done) => {
        request(app)
            .get('/todos/'+todos[1]._id)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo
                    .findById(todos[1]._id)
                    .then((todo) => {
                        expect(todo).toExist();
                        done();
                    })
                    .catch((err) => done(err))
                    ;

            })
            ;
    });
});

describe('DELETE /todos/:id' , () => {
    it('should delete todo' , (done) => {
        request(app)
            .delete('/todos/'+todos[0]._id)
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
                expect(res.body.todo._id).toBe(todos[0]._id.toHexString());
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(todos[0]._id).then((todo) => {
                    expect(todo).toNotExist();
                }).catch((err) => done(err));
                done();
            })
            ;
    });

    it('should return 404 for invalid todo id' , (done) => {
        request(app)
            .delete('/todos/'+123)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)            
            .end(done)
            ;
    });



    it('should return 404 if todo not found' , (done) => {
        request(app)
            .delete('/todos/'+new ObjectID().toHexString())
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)            
            .end(done)
            ;
    });

    it('should return 404 if tries to delete todo of someone else' , (done) => {
        request(app)
            .delete('/todos/'+todos[1]._id)
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)            
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo
                    .findById(todos[1]._id)
                    .then((todo) => {
                        expect(todo).toExist();
                        done();
                    })
                    .catch((err) => done(err))
                    ;
            })
            ;
    });

});

describe('PATCH /todos/:id' , () => {
    it('should return 404 for invalid id' , (done) => {
        request(app)
            .patch('/todos/'+123)
            .send({})
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done)
            ;
    });

    it('should return 404 for non exist id' , (done) => {
        request(app)
            .patch('/todos/'+new ObjectID().toHexString())
            .send({})
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done)
            ;
    });

    it('should return 404 when tries to update todo created by someone else' , (done) => {
        request(app)
            .patch('/todos/'+todos[1]._id)
            .send({})
            .set('x-auth',users[0].tokens[0].token)
            .expect(404)
            .end(done)
            ;
    });

    it('should update the todo' , (done) => {
        var text = 'updated';
        request(app)
            .patch('/todos/'+todos[0]._id)
            .send({completed: true,text: text})
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(todos[0]._id).then((todo) => {
                    expect(todo.completed).toBe(true);
                    expect(todo.completedAt).toBeA('number');
                    expect(todo.text).toBe(text);
                    done();
                }).catch((err) => done(err))
            })
            ;
    });

    it('should clear completedAt when todo is not completed' , (done) => {
        request(app)
            .patch('/todos/'+todos[2]._id)
            .send({completed:false})
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                Todo.findById(todos[2]._id).then((todo) => {
                    expect(todo.completed).toBe(false);
                    expect(todo.completedAt).toNotExist();
                    expect(todo.text).toBe(todos[2].text);
                    done();
                }).catch((err) => done(err))
            })
            ;
    });
});

describe('POST /users', () =>{    
    it('should create the user' ,(done) => {
        var email = 'test_post@example.com';
        var password = 'test_post';
        request(app)
            .post('/users')
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
                expect(res.get('x-auth')).toExist();
                

                User
                    .count({}).then((count) => {                        
                       expect(count).toBe(3);
                        //done();
                    })
                    .catch((err) => done(err));   
                    
                    User.findOne({email}).then((user) => {
                        expect(user._id).toExist();
                        expect(user.email).toBe(email);
                        expect(user.password).toNotBe(password);
                        expect(user.tokens[0].token).toExist();
                        expect(user.tokens[0].access).toBe('auth');
                        done();
                    })
                    .catch((err) => done(err))
                    ; 
                   
            });
    });

    it('should not create the user as email is not valid', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'abcdefg',
                password: 'abc123'
            })
            .expect(500)
            .end(done);
    });

    it('should not create the user as password length is less than 6', (done) => {
        request(app)
            .post('/users')
            .send({
                email: 'abcdefg@org.com',
                password: 'abc'
            })
            .expect(500)
            .end(done);
    });

    it('should not create the user as email is not provided', (done) => {
        request(app)
            .post('/users')
            .send({                
                password: 'abc'
            })
            .expect(500)
            .end(done);
    });

    it('should not create the user as password is not provided', (done) => {
        request(app)
            .post('/users')
            .send({                
                email: 'abc@gmail.com'
            })
            .expect(500)
            .end(done);
    });

    it('should not create the user as email is in use', (done) => {
        request(app)
            .post('/users')
            .send({
                email: users[0].email,
                password: users[0].password
            })
            .expect(500)
            .end(done);
    });
});

describe('GET /users/me' , () => {
    it('should authenticate the user' , (done) => {       
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err,res) => {
                if(err){
                    return done(err);
                }
                //console.log('res',res);
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
                done();
            });            
    });

    it('should not authenticate the user' , (done) => {       
        request(app)
            .get('/users/me')
            .set('x-auth', 'abc123')
            .expect(401)
            .end(done);            
    });
});

describe('POST /users/login' , () => {
   it('should allow user to login' , (done) => {
       var email = users[1].email;
       var password = users[1].password;
        request(app)
            .post('/users/login')
            .send({
                email: email,
                password: password
            })
            .expect(200)
            .expect((res) => {
                //console.log(res.get('x-auth'));
                expect(res.get('x-auth')).toExist();
                expect(res.body._id).toBe(users[1]._id.toHexString());
                expect(res.body.email).toBe(users[1].email);
            })
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    expect(user.tokens[0].token).toBe(res.get('x-auth'));
                    expect(res.body._id).toBe(user._id.toHexString());
                    expect(res.body.email).toBe(user.email);
                    done();
                })
            })
            ;
   });

   it('should not allow user to login if email is not in system',(done) => {
        request(app)
         .post('/users/login')
         .send({
             email: 'abcddef@gmail.com',
             password: 'abc123'
         })
         .expect(401)
         .end(done);
   });

   it('should not allow user to login if email is in system but password is incorrect',(done) => {
       var email = users[1].email;
    request(app)
     .post('/users/login')
     .send({
         email: email,
         password: 'abc123'
     })
     .expect(401)
     .end((err,res) => {
         if(err){
             return done(err);
         }

         User.findOne({email}).then((user) => {
            expect(user.tokens.length).toBe(0);
            done();
         });
     });
    });
});

describe('DELETE /users/me/token' ,() => {   
    it('should delete the token' , (done) => {
        var email = users[0].email;
        var xAuth = users[0].tokens[0].token;
        request(app)
            .delete('/users/me/token')
            .set('x-auth',xAuth)
            .expect(200)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                });
            })
    });

    it('should not delete the token' , (done) => {
        var email = users[0].email;
        var xAuth = 'invalid-token';
        request(app)
            .delete('/users/me/token')
            .set('x-auth',xAuth)
            .expect(401)
            .end((err,res) => {
                if(err){
                    return done(err);
                }

                User.findOne({email}).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                })
                .catch((err) => done(err))
                ;
            })
    });
});


