const {MongoClient , ObjectID} = require('mongodb');

const mongoUri = 'mongodb://docker-host:27017';
MongoClient.connect(mongoUri,(err,client) => {
    if(err){
        return console.error('Unable to connect to mongodb.',err);        
    }
    console.info('Connected to mongodb');
    const db = client.db('TodoApp');     
   
   db.collection('Todos').findOneAndUpdate(
        {
            _id: new ObjectID('5b72fcfe294d5e8c1a8efe48')
        },
        {
            $set: {
              completed: true  
            }
        },
        {
            returnOriginal: false 
        }

    )
    .then((result) => {
        console.info(result);
    })
    ;

    //close the client
    client.close();
});