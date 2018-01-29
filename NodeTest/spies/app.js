var db = require('db.js');

module.exports.handleSignup = (email,password) =>{
    db.saveUser({
        email,
        password
    });
};