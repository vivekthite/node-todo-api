const mongoose = require('mongoose');
const validator = require('validator');
const {sign} = require('jsonwebtoken');
const {pick} = require('lodash');

var userSchema = new mongoose.Schema({
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


userSchema.methods.generateAuthToken = function(access) {   
    var token = sign({id: this._id.toHexString(),access},'abc123').toString();        
    return token;
}; 

userSchema.methods.toJSON = function() {
    return pick(this,['_id','email']);
};

var User = mongoose.model('users',userSchema);

 module.exports = {
     User
 } 
