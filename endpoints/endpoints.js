var express = require('express');
var router = express.Router();
var DAL = require('../DAL/DAL');

var mysql = require('mysql');

//change host, login, password, ...
var con = mysql.createConnection({
    host: "localhost",
    user: "Sparx",
    password: "123456789",
    database: "download_files"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
});

router.get('/', function(req, res, next) {
    res.json({'endpoint': '/'});
});

//endpoint /download/ID where ID MUST be a number
router.get('/download/:id(\\d+)', function(req, res, next) {
    DAL.downloadFile(req, res, con);
});

module.exports = router;