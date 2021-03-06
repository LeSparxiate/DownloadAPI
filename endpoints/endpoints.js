var express = require('express');
var router = express.Router();
var DAL = require('../DAL/DAL');

//endpoints are available here
router.get('/', function(req, res, next) {
    res.json({'endpoint': '/'});
});

router.post('/upload', function(req, res, next) {
    DAL.uploadFile(req, res);
});

//endpoint /download/ID where ID MUST be a number
router.get('/delete/:id(\\d+)', function(req, res, next) {
    DAL.deleteFile(req, res);
});

//Filters ?
router.get('/download/page/:nopage(\\d+)', function(req, res, next) {
    DAL.downloadList(req, res);
});

//endpoint /download/ID where ID MUST be a number
router.get('/download/:id(\\d+)', function(req, res, next) {
    DAL.downloadFile(req, res);
});

router.get('/download/qr/:id(\\d+)', function(req, res, next) {
    DAL.downloadQR(req, res);
});

module.exports = router;