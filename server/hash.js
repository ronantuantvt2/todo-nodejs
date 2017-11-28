const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123!';

bcrypt.genSalt(9, (err, salt) => {
    console.log(salt);
    bcrypt.hash(password, salt, (err, hash) => {
        console.log(hash);
    });
});

var hashedPassword = '$2a$09$ib24Y.qNMzHzB7eEJz5cYuded0bJzjOck1e8C2wj6PoH03bMjGOtC';
bcrypt.compare(password, hashedPassword, (err, res) => {
    console.log(res);
});

/*
var message = "Hello world";
var hash = SHA256(message);

console.log(hash.toString());

 var data = {id: 10};

var tokens = jwt.sign(data, 'secret-key');
console.log(tokens);

var decode = jwt.verify(tokens, 'secret-key');
console.log(decode);
*/