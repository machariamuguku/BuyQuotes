const http = require('http');
const express = require('express');
const path = require('path');
const logger = require('morgan');

// Require router module here ...
const router = require('./router');

const app = express();

// const port = process.env.PORT;
const port = 1800;

app.set('port', port);

// view engine setup
app.set('view engine', 'html');
app.engine('html', require('hbs').__express);

// set views folder
app.set('views', path.join(__dirname, 'views'));

// Set resources folder
app.use(express.static(path.join(__dirname, "resources")));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

// Use router module here ...
app.use(router);

// 404 handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
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
    console.log('Application Ready!');
});