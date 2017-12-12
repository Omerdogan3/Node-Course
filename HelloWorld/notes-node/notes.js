console.log("Starting notes.js");

// module.exports.addNote = () =>{
//     console.log('addNote');
//     return 'New Note';
// };

// module.exports.add = (a,b) =>{
//     return a+b;
// };

const fs = require('fs');

var fetchNotes = () => {
    try{
        var noteString = fs.readFileSync('notes-data.json');
        return JSON.parse(noteString);
    }catch(e){
        return [];
    }
};

var logNote = (note) => {
    console.log('--');
    console.log(`Title: ${note.title}`);
    console.log(`Body: ${note.body}`);
};

var saveNotes = (notes) =>{
    fs.writeFileSync('notes-data.json',JSON.stringify(notes));
};

var addNote = (title,body) =>{
    var notes = fetchNotes();
    var note = {
        title,
        body
    };

    var duplicateNotes = notes.filter((note) => note.title === title);
    if(duplicateNotes.length === 0){
        notes.push(note);
        saveNotes(notes);
        return note;
    }
};

var getNotes = () =>{
    console.log('Getting All Notes');
};

var readNote = (title) =>{
    var notes = fetchNotes();
    var filteredNotes = notes.filter((note)=>{
        return note.title === title;
    });
    return filteredNotes[0];
};

var removeNote = (title) =>{
    console.log('Removing note', title);
    //fetch notes
    //filter notes, removing with title
    var notes = fetchNotes();

    var removedNotes = notes.filter((note) => note.title !== title);
    saveNotes(removedNotes);

    return notes.length !== removedNotes.length;
};

module.exports = {
    addNote,
    getNotes,
    readNote,
    removeNote,
    logNote
};