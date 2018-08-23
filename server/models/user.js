const mongoose = require('mongoose');
const validator = require('validator');
const {sign,verify} = require('jsonwebtoken');
const {pick} = require('lodash');
const {genSalt,hash} = require('bcryptjs');

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

userSchema.statics.findByToken = function(token){    
    var decoded;
    try {
        decoded = verify(token,'abc123');
    } catch (error) {
        return Promise.reject();
    }
    return this.findOne({
        'tokens.token': token
    });
};

userSchema.pre('save', function(next){   
    if(this.isModified('password')){        
        genSalt(10).then((salt) => {            
            hash(this.password,salt).then((hash) => {
                this.password=hash;
                next();
            });                      
        });
    }else{
        next();
    }
    
});

var User = mongoose.model('users',userSchema);

 module.exports = {
     User
 } 
