const {SHA256} = require('crypto-js');

var text = "Hello how t u?";

var hashedText = SHA256(text).toString();

console.log('Orginal text : ',text);
console.log('Hashed text',hashedText);

var data = {
    id: 3
}

var token = {
    data,
    hash: SHA256(JSON.stringify(data) + 'secretSalt').toString()
}





var resultHash = SHA256(JSON.stringify(token.data) + 'secretSalt').toString();

/* 
token.data.id = 4;
token.hash = SHA256(JSON.stringify(data)).toString();

 */
if(resultHash === token.hash){
    console.log('Data is intact');
}else{
    console.log('Data is changed. Do not trust');
}   