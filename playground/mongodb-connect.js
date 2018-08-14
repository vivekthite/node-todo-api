const MongoClient = require('mongodb').MongoClient;

const mongoUri = 'mongodb://docker-host:27017';
MongoClient.connect(mongoUri,(err,client) => {
    if(err){
        return console.error('Unable to connect to mongodb.',err);        
    }
    console.info('Connected to mongodb');
    const db = client.db('TodoApp'); 
    
    //insert doc in Todos collection
    db.collection('Todos').insertOne({
        text: 'something todo',
        completed: false
    },(err,result) => {
        if(err){
            return console.error('Unable to insert todo',err);
        }
        console.info(JSON.stringify(result.ops,undefined,2));
    });

    //insert doc in users collection
    db.collection('users').insertOne({       
        name : 'Sam',
        age: 27,
        location: 'New Pune'
    },(err,result) => {
        if(err){
            return console.error('Unable to insert user',err);
        }
        console.info(JSON.stringify(result.ops,undefined,2));
        console.info(result.ops[0]._id.getTimestamp());
    });

    //close the client
    client.close();
});