const mongoose = require('mongoose');

var User = mongoose.model('users',{
    email: {
        type: String,
        minlength: 1,
        trim: true,
        required: true
    }
  });

 module.exports = {
     User
 } 
