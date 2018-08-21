const mongoose = require('mongoose');
const validator = require('validator');

var User = mongoose.model('users',{
    email: {
        type: String,
        minlength: 1,
        trim: true,
        required: [true, 'User email required'],
        unique: true,
        validate: {
            validator: (value) => {
              return validator.isEmail(value);
            },
            message: props => `${props.value} is not a valid email!`
          }
    },
    password:{
        type: String,
        required: [true, 'User password required'],
        minlength: 6
    },
    tokens: [
        {
            access:{
                type: String,
                required: true
            },
            token:{
                type: String,
                required: true
            }
        }
    ]
  });

 module.exports = {
     User
 } 
