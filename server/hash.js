const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');

/*
var message = "Hello world";
var hash = SHA256(message);

console.log(hash.toString());
*/
 var data = {id: 10};

var tokens = jwt.sign(data, 'secret-key');
console.log(tokens);

var decode = jwt.verify(tokens, 'secret-key');
console.log(decode);