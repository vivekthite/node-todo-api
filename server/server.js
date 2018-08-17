const express = require('express');
const bodyParser = require('body-parser');
const {Todo} = require('./models/todo');
const {User} = require('./models/user');
const {mongoose} = require('./db/mongoose');

const app = express();
const port = 3000;

app.use(bodyParser.json());

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

app.listen(port,() => {
    console.info('server started at port '+port);
});

//export app so that it can be accessed in test scripts
module.exports = {
    app
}
