var express = require('express');
var endpoints = require('./endpoints/endpoints');

const port = 80;
var api = express();

api.use('/', endpoints);

// catch 404 and forward to error handler
api.use(function(req, res, next) {
    res.status(404).json({ error: 'Not Found' });
});

module.exports = api;

api.listen(port, function (err) {
    console.log("Listening on port", port);
});