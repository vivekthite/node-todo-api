const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://docker-host:27017/TodoApp');

module.exports = {
    mongoose
}