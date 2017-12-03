console.log('Hello World');

const fs = require('fs');
const os = require('os');
const notes = require('./notes.js');

// let user = os.userInfo();
// fs.appendFile('message.txt', `Hello ${user.username} You are ${notes.age}` );

// var res = notes.addNote();
var sum = notes.add(3,5);
console.log(sum);