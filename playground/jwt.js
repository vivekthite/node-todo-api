const {sign,verify} = require('jsonwebtoken');

var data = {
    id:5
};

var token = sign(data,'abc123');
console.log('jwt : ',token);

var decoded = verify(token,'abc123');
console.log('decoded : ',decoded);