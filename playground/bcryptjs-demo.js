const {genSalt,hash,compare} = require('bcryptjs');

genSalt(10).then((salt) => {
    console.log(salt);
    hash('abc123!',salt).then((hash) => {
        console.log(hash);
    });
});



/* 

var hashedPassword = '$2a$10$RGofndWX2rNozaZvo3OzYO7a8oWKpj0MGpQ81MGbiiUeFEXwzkEJe';

compare('abc123!1',hashedPassword).then((result) => {
    console.log(result);
});


 */