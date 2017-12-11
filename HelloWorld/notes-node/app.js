console.log('Hello World');

const fs = require('fs');
const os = require('os');
const _ = require('lodash');
const yargs = require('yargs');

const notes = require('./notes.js');

// let user = os.userInfo();
// fs.appendFile('message.txt', `Hello ${user.username} You are ${notes.age}` );

// console.log(_.isString(true));
// console.log(_.isString('Andrew'));

// console.log(process.argv);



const argv = yargs.argv;
var command = process.argv[2];

console.log('Command: ' + command);
console.log('Yargs: ',  argv);

if(command === 'add'){
    notes.addNote(argv.title, argv.body);
}else if(command === 'list'){
    notes.getNotes();
}else if(command === 'read'){
    notes.readNote(argv.title);
}else if(command === 'remove'){
    notes.removeNote(argv.title);
}else{
    console.log('Command not recognized');
}





// var res = notes.addNote();
// var sum = notes.add(3,5);
// console.log(sum);



