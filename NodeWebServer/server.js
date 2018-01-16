const express = require('express');

var app = express();

app.get('/', (req,res) =>{
    // res.send('Hello Express');
    res.send({
        name: 'Andrew',
        likes: ['Biking','Cities']
    });
});

app.get('/about', (req,res) =>{
    res.send('About Page');
});

app.listen(3000);