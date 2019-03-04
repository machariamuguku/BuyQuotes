const http = require('http');
const express = require('express');
const path = require('path');
const morganlogger = require('morgan');
const cors = require('cors')
const bodyParser = require('body-parser');
const expressValidator = require("express-validator");

// Require router module here ...
const router = require('./router');

const app = express();

// add bodyparser and cors
app.use(bodyParser.json());
app.use(cors());

// express-validator middleware
app.use(expressValidator());

const port = process.env.PORT || 1800;

app.set('port', port);

// view engine setup
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

// set views folder
app.set('views', path.join(__dirname, './src/frontend/views'));

// Set resources folder
app.use(express.static(path.join(__dirname, "./src/frontend/resources")));

// initialize morgan to log output to a file
var fs = require('fs');

app.use(morganlogger('common', {
    stream: fs.createWriteStream('./morganlogs.log', {
        flags: 'a'
    })
}));

app.use(morganlogger('dev'));
// other middleware
app.use(express.urlencoded({
    extended: false
}));

// Use router module here ...
app.use(router);

// 404 handler
app.use((req, res, next) => {
    const err = new Error('That Page Was Not Found. Go Back Home');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

// Start the server
const server = http.createServer(app);
server.listen(port);
server.on('listening', () => {
    console.log('The Node-Express app started successfuly');
});