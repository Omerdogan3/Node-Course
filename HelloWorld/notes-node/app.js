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
    var note = notes.addNote(argv.title, argv.body);
    if(note){
        console.log('Note created');
        notes.logNote(note);
    }else{
        console.log('Note title taken');
    }
}else if(command === 'list'){
    notes.getNotes();
}else if(command === 'read'){
    var note = notes.readNote(argv.title);
    if(note){
        console.log('Note found');
        notes.logNote(note);
    }else{
        console.log('Note not found');
    }
}else if(command === 'remove'){
    var removedNotes = notes.removeNote(argv.title);
    var message = removedNotes ? 'Note was removed' : 'Note not found';
    console.log(message);
}else{
    console.log('Command not recognized');
}





// var res = notes.addNote();
// var sum = notes.add(3,5);
// console.log(sum);



