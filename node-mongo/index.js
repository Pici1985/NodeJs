const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const dbOper = require('./operations')

const url = 'mongodb://localhost:27017'; 
const dbname = 'conFusion'; 

MongoClient.connect(url, (err, client) => {
    assert.equal(err, null);
    
    console.log('Connected to Database');

    const db = client.db(dbname);
    const collection = db.collection('dishes');

    // practice method
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

    dbOper.insertDocument(db, { name: "Vadonut", description: "Test"}, 'dishes', (result) => {

        console.log('Insert document:\n', result.ops);

        dbOper.findDocuments(db, 'dishes', (docs) => {
            console.log('Found documents:\n', docs);

            dbOper.updateDocument(db, {name: 'Vadonut'}, {description: 'Updated test'}, 'dishes', (result) => {
                console.log('Updated documet\n', result.result);

                dbOper.findDocuments(db, 'dishes', (docs) => {
                    console.log('Found documents:\n', docs);
                    
                    db.dropCollection('dishes', (result) => {
                        console.log('Dropped Collection: ', result);

                        client.close();
                    });
                });
            });
        });
    });   
});
