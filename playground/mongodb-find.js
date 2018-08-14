const MongoClient = require('mongodb').MongoClient;

const mongoUri = 'mongodb://docker-host:27017';
MongoClient.connect(mongoUri,(err,client) => {
    if(err){
        return console.error('Unable to connect to mongodb.',err);        
    }
    console.info('Connected to mongodb');
    const db = client.db('TodoApp');     
    
    //fetch all docs
    db.collection('Todos').find().toArray().then((docs) => {
        console.info('All docs');
        console.info(JSON.stringify(docs,undefined,2));
    },(error) => {
        console.error('Error while fetching Todos docs',error);
    });

    // all docs count
    db.collection('Todos').find().count().then((count) => {
        console.info('All docs count : '+count);        
    },(error) => {
        console.error('Error while fetching Todos docs',error);
    });
    
    //fetch completed docs
    db.collection('Todos').find({completed:true}).toArray().then((docs) => {
        console.info('Completed docs');
        console.info(JSON.stringify(docs,undefined,2));
    },(error) => {
        console.error('Error while fetching Todos docs',error);
    });

    //close the client
    client.close();
});