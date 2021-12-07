const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbOper = require('./operations')

const url = 'mongodb://localhost:27017'; 
const dbname = 'conFusion'; 

// practice method to insert one document
// MongoClient.connect(url, (err, client) => {
//     assert.equal(err, null);
    
//     console.log('Connected to Database');

//     const db = client.db(dbname);
//     const collection = db.collection('dishes');


    // collection.insertOne({ "name": "Uthappizza", "description": "test"}, (err, result) => {
    //     assert.equal(err, null); 
        
    //     console.log('After insert: \n');
    //     console.log(result.ops);

    //     collection.find({}).toArray((err, docs) => {
    //         assert.equal(err, null); 
            
    //         console.log('Found: \n');
    //         console.log(docs);
            
    //         db.dropCollection('dishes', (err, result) => {
    //             assert.equal(err, null); 

    //             client.close();
    //         });
    //     });
    // });


// db operations using callbacks eg. "Callback hell"
// MongoClient.connect(url, (err, client) => {
//     assert.equal(err, null);
    
//     console.log('Connected to Database');

//     const db = client.db(dbname);
//     const collection = db.collection('dishes');

//     dbOper.insertDocument(db, { name: "Vadonut", description: "Test"}, 'dishes', (result) => {

//         console.log('Insert document:\n', result.ops);

//         dbOper.findDocuments(db, 'dishes', (docs) => {
//             console.log('Found documents:\n', docs);

//             dbOper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated test'}, 'dishes', (result) => {
//                 console.log('Updated documet\n', result.result);

//                 dbOper.findDocuments(db, 'dishes', (docs) => {
//                     console.log('Found documents:\n', docs);
                    
//                     db.dropCollection('dishes', (result) => {
//                         console.log('Dropped Collection: ', result);

//                         client.close();
//                     });
//                 });
//             });
//         });
//     });   
// });

// db operations using promises
MongoClient.connect(url).then((client) => {
    
    console.log('Connected to Database');

    const db = client.db(dbname);

    dbOper.insertDocument(db, { name: "Vadonut", description: "Test"}, 'dishes')
        .then((result) => {
            console.log('Insert document:\n', result.ops);

            return dbOper.findDocuments(db, 'dishes');
        })
        .then((docs) => {
            console.log('Found documents:\n', docs);

            return dbOper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated test'}, 'dishes')
        })
        .then((result) => {
            console.log('Updated documet\n', result.result);

            return dbOper.findDocuments(db, 'dishes');
        })
        .then((docs) => {
            console.log('Found documents:\n', docs);
                    
            return db.dropCollection('dishes');
        })
        .then((result) => {
            console.log('Dropped Collection: ', result);

            client.close();
        })
        .catch((err) => console.log(err));
    })
    .catch((err) => console.log(err));
