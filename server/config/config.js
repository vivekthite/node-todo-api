const env = process.env.NODE_ENV || 'development';

if(env === 'development'){
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://docker-host:27017/TodoApp';
}else if(env.trim() === 'test'){    
    process.env.PORT = 3000;
    process.env.MONGODB_URI = 'mongodb://docker-host:27017/TodoAppTest';
}

console.info('env ******',env);
console.info('process.env.MONGODB_URI ******',process.env.MONGODB_URI);