const env = process.env.NODE_ENV || 'development';


/* 
if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://docker-host:27017/TodoApp';
}else if(env.trim() === 'test'){    
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://docker-host:27017/TodoAppTest';
}

 */


 

 
 if(env === 'development' || env.trim() === 'test') {

    const config = require('./config.json');
    const envObject = config[env.trim()];

    /* 
        console.log(config); 
        console.log(envObject);
        console.log(Object.keys(envObject));
    */
    Object.keys(envObject).forEach((key) => {
        //console.log(key);
        process.env[key] = envObject[key];
        //console.log(process.env[key]);
    });

}

console.info('env ******',env);
console.info('process.env.MONGODB_URI ******',process.env.MONGODB_URI);