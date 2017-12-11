console.log("Starting notes.js");

// module.exports.addNote = () =>{
//     console.log('addNote');
//     return 'New Note';
// };

// module.exports.add = (a,b) =>{
//     return a+b;
// };

var addNote = (title,body) =>{
    console.log('Adding Note', title , body);
};

var getNotes = () =>{
    console.log('Getting All Notes');
};

var readNote = (title) =>{
    console.log('Getting note', title);
};

var removeNote = (title) =>{
    console.log('Removing note', title);
};

module.exports = {
    addNote,
    getNotes,
    readNote,
    removeNote
};