const {ObjectID} = require('mongodb');

const {Todo} = require('./../server/models/todo');
const {mongoose} = require('./../server/db/mongoose');

/* 

Todo.remove({}).then((result) => {
    console.log(result);
});

 */

 Todo.findByIdAndRemove('5b7aa6cd0c4cfb7f02d130f6').then((result) => {
     console.log(result);
 });

 //Todo.findOneAndRemove