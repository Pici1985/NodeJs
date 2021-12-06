const express = require('express');
const http = require('http');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const dishRouter = require('./routes/dishRouter');
const leaderRouter = require('./routes/leaderRouter');
const promoRouter = require('./routes/promoRouter');

const hostname = 'localhost';
const port = 5000;

const app = express();

// App.use

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/dishes', dishRouter);

app.use('/dishes/:dishId', dishRouter);

app.use('/leadership', leaderRouter);
app.use('/leaders/:leaderId', leaderRouter);

app.use('/promotions', promoRouter);
app.use('/promotions/:promoId', promoRouter);

app.use(express.static(__dirname + '/public'));
// next is an optional parameter
app.use((req, res, next) => {
    // console.log(req.headers); morgan will take car of this
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.end('<html><body><h1>This is an Express Server</h1></body></html>');    
});

// Server

const server = http.createServer(app);

server.listen(port, hostname, () => {
    console.log(`Server listening at http://${hostname}:${port}/ `)
});

// API endpoints
// been moved to dishRouter.js 

// app.all('/dishes', (req,res,next) => {
    //     res.statusCode = 200;
    //     res.setHeader('Content-Type','text/plain');
    //     next();
    // });
    
// app.get('/dishes', (req,res,next) => {
//     res.end('Will send all the dishes to you!');
// });

// app.post('/dishes', (req,res,next) => {
//     res.end('Will add the dish: ' + req.body.name + ' with details: ' + req.body.description );
// });

// app.put('/dishes', (req,res,next) => {
//     res.statusCode = 403;
//     res.end('PUT operation not supported on /dishes' );
// });

// app.delete('/dishes', (req,res,next) => {
//     res.end('Deleting all the dishes!!');
// });

// Api endpoints with dish ID

// app.get('/dishes/:dishId', (req,res,next) => {
//     res.end('Will send details of the dish: ' + req.params.dishId + ' to you!');
// });

// app.post('/dishes/:dishId', (req,res,next) => {
//     res.statusCode = 403;
//     res.end('POST operation not supported on /dishes/' + req.params.dishId );
// });

// app.put('/dishes/:dishId', (req,res,next) => {
//     res.write('Updating the dish: ' + req.params.dishId + '\n');
//     res.end('Will update the dish: ' + req.body.name + ' with details: ' + req.body.description);
// });

// app.delete('/dishes/:dishId', (req,res,next) => {
//     res.end('Deleting dish: ' + req.params.dishId );
// });