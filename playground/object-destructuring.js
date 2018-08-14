const {MongoClient,ObjectID}=require('mongodb');

var objId = new ObjectID();
console.log(objId);

const user = {
    name: 'sam',
    age: 25,
    location: 'pune'
};

const {name} = user;
console.log(name);