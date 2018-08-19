const {ObjectID} = require('mongodb');

const {Todo} = require('./../server/models/todo');
const {mongoose} = require('./../server/db/mongoose');

const id = '6b76d7da9d851c15e4ae03d1123'; 

/* 

Todo.find({
    _id: id
}).then((todos) => {
    console.info('Todos',todos);
});

Todo.findOne({
    _id: id
}).then((todo) => {
    console.info('Todo',todo);
});


 */

if(!ObjectID.isValid(id)){
    return console.info('Id not valid');
}

Todo.findById(id).then((todo) => {
    if(!todo){
        return console.info('Id not found');
    }
    console.info('Todo',todo);
}).catch((e) => console.error(e));