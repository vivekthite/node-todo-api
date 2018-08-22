require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');

const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {mongoose} = require('./db/mongoose');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());

//create todo
app.post('/todos' , (req,res) => {
    var todo = new Todo({
        text: req.body.text
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
app.get('/todos',(req,res) => {
    Todo.find({}).then((todos) => {
        res.send({todos});
    },(err) => {
        res.status(500).send(err);
    });
});

//get todo by id
app.get('/todos/:id' , (req,res) => {
    //check if id is valid
    var id = req.params.id;
    if(!ObjectID.isValid(id)){
        console.error('Id not valid : ',id);
        return res.status(404).send({});
    }

    console.info('valid id : ',id);
    //id is valid so search in db
    Todo.findById(req.params.id).then((todo) => {
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
app.delete('/todos/:id' , (req,res) => {
    var id = req.params.id;

    //if id not valid then return 404
    if(!ObjectID.isValid(id)){
        return res.sendStatus(404).send();
    }

    Todo.findByIdAndRemove(id).then((todo) => {
        if(!todo){
            return res.sendStatus(404).send();
        }
        return res.send({todo});
    }).catch((err) => {
        return res.sendStatus(500).send(err);
    })
});

//update todo
app.patch('/todos/:id' , (req,res) => {
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
    Todo.findByIdAndUpdate(id,
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
    var access = "auth";
    var token = user.generateAuthToken(access);
    user.tokens.push({access,token});
    //console.log('user',user);   
    user.save().then((savedUser) => {        
        return res.header('x-auth',token).send(savedUser);
    })    
    .catch((err) => {
        console.error(err);
        return res.status(500).send(err);
    });
});

app.listen(port,() => {
    console.info('server started at port '+port);
});

//export app so that it can be accessed in test scripts
module.exports = {
    app
}
