const {MongoClient , ObjectID} = require('mongodb');

const mongoUri = 'mongodb://docker-host:27017';
MongoClient.connect(mongoUri,(err,client) => {
    if(err){
        return console.error('Unable to connect to mongodb.',err);        
    }
    console.info('Connected to mongodb');
    const db = client.db('TodoApp');     
   
    //deleteMany
    db.collection('Todos').deleteMany({text: "Eat lunch"}).then((result) => {
        console.info(result);
    },(error) => {
        console.error('Error while deleting document',error);
    });

    //deleteOne
    db.collection('Todos').deleteOne({text: "Take pills"}).then((result) => {
        console.info(result);
    },(error) => {
        console.error('Error while deleting document',error);
    });

    //findOneAndDelete
    db.collection('Todos').findOneAndDelete({_id: new ObjectID('5b72d5e7294d5e8c1a8efd65')}).then((result) => {
        console.info(result);
    },(error) => {
        console.error('Error while deleting document',error);
    });

    //close the client
    client.close();
});