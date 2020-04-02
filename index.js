var express = require('express');
var endpoints = require('./endpoints/endpoints');
var busboy = require('connect-busboy');

const port = 80;
var api = express();

api.use(busboy({
    highWaterMark: 2 * 1024 * 1024
}));

api.use('/', endpoints);

// catch 404 and forward to error handler
api.use(function(req, res, next) {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = api;

api.listen(port, function (err) {
    console.log("Listening on port", port);
});