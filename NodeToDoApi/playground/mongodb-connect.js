const MongoClient = require('mongodb').MongoClient;

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err,db)=>{
    if(err){
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB server');

    db.collection('Todos').insertOne({
        text: 'Sometihng to do',
        completed: false
    },(err,result)=>{
        if(err){
            return console.log('Unable to insert todo');
        }
        console.log(JSON.stringify(result.ops, undefined, 2));
    });


    // db.collection('Users').insertOne({
    //     name: 'Andrew',
    //     age: 25,
    //     location: 'Philadelphia'
    //   }, (err, result) => {
    //     if (err) {
    //       return console.log('Unable to insert user', err);
    //     }
    
    //     console.log(result.ops);
    //   });

    db.close();
});