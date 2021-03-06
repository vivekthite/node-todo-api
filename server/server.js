require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {mongoose} = require('./db/mongoose');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//create todo
app.post('/todos' , authenticate , (req,res) => {
    var todo = new Todo({
        text: req.body.text,
        _creator: req.user._id
    });

    todo.save().then((doc) => {
        //console.info(doc);
        res.send(doc);
    },(err) => {
        //console.error(err);
        res.status(500).send(err);
    });
});

//list todos
app.get('/todos',authenticate,(req,res) => {
    Todo.find({_creator:req.user._id}).then((todos) => {
        res.send({todos});
    },(err) => {
        res.status(500).send(err);
    });
});

//get todo by id
app.get('/todos/:id' , authenticate, (req,res) => {
    //check if id is valid
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        console.error('Id not valid : ',id);
        return res.status(404).send({});
    }

    console.info('valid id : ',id);
    //id is valid so search in db
    Todo.findOne({
        _id: new ObjectID(req.params.id),
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            //todo not found
            console.info('Todo not found for : ',id);
            return res.status(404).send({});            
        }
        console.log('Todo found for : ',id);
        return res.send({todo});
    } , (err) => {
        console.error('Error while fetching Todo  ',err);
        return res.status(500).send(err);
    }).catch((err) => {
        console.error('Error while fetching Todo  ',err);
        return res.status(500).send(err);
    });
});

//remove doc by id
app.delete('/todos/:id' , authenticate ,(req,res) => {
    var id = req.params.id;

    //if id not valid then return 404
    if(!ObjectID.isValid(id)){
        return res.sendStatus(404).send();
    }

    Todo.findOneAndRemove({
        _id: new ObjectID(id),
        _creator: req.user._id
    }).then((todo) => {
        if(!todo){
            return res.sendStatus(404).send();
        }
        return res.send({todo});
    }).catch((err) => {
        return res.sendStatus(500).send(err);
    })
});

//update todo
app.patch('/todos/:id' ,authenticate ,(req,res) => {
    var id = req.params.id;

     //if id not valid then return 404
     if(!ObjectID.isValid(id)){
        return res.sendStatus(404).send();
    }

    //catch up only required attributes
    var body = _.pick(req.body,['text','completed']);

    //if completed is true then set complatedAt else unset it
    if(_.isBoolean(body.completed) && body.completed){
        body.completedAt = new Date().getTime();
    }else{
        body.completed = false;
        body.completedAt = null;
    }

    //now update todo    
    Todo.findOneAndUpdate({
                _id: id,
                _creator: req.user._id
            },
            {
                $set: body
            },
            {
                new: true
            })
            .then((todo) => {
                if(!todo){
                    return res.sendStatus(404).send();
                }
                return res.send({todo});
            })
            .catch((err) => {
                return res.sendStatus(500).send(err);
            })

});

//create new user
app.post('/users' , (req,res) => {    
    var user = new User(_.pick(req.body,['email','password'])); 
    
    user.generateAuthTokenAndSave().then((token) => {
         res.header('x-auth',token).send(user);
    })
    .catch((err) => {
        //console.error(err);
        res.status(500).send(err);
    })
    ;    
});

//get user info
app.get('/users/me' ,authenticate, (req,res) => {
  res.send(req.user);
});

//user login
app.post('/users/login' , (req,res) => {
    var body = _.pick(req.body,['email','password']);
    //console.log(body);
    User
        .findByCredentials(body.email,body.password)
        .then((user) => {
            user.generateAuthTokenAndSave().then((token) => {
                res.header('x-auth',token).send(user);
            });           
        })
        .catch((err) => res.status(401).send())
        ;   
});

app.delete('/users/me/token',authenticate,(req,res) => {
    req.user.deleteToken(req.token).then(() => {
        //send 200 if deleted successfuly
        res.send();
    })
    .catch((err) => res.status(500).send())
    ;
});

app.listen(port,() => {
    console.info('server started at port '+port);
});

//export app so that it can be accessed in test scripts
module.exports = {
    app
}
