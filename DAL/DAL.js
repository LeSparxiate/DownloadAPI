var request = require('./requests');
var qrcode = require('qrcode');
var ip = require('ip');
var fs = require('fs');
var path = require('path');
var moment = require('moment');
var crypto = require('crypto');
var uploadPath = "./upload/";

module.exports = {
    //start the download of the file specified in ID
    downloadFile: function (req, res) {
        var idfile = req.params["id"];

        //SQL query to get the file url stored in database
        var sql = "select f.idfiles, f.filepath, f.downloaded, f.available, f.description from files f where f.idfiles = ?";
        request.performQuery(sql, [idfile], function(response) {
            //if response contains a result we start the download for client
            if (response !== undefined && response.length > 0 && response[0].available == 1) {
                res.download(response[0].filepath, response[0].description, function (err) {
                    if (err) {
                        //on big file stream like movies it throws an ECONNABORTED
                        //didn't figure out why but stream works fine anyway
                        //I'm muting the error until I find the reason
                    } else {
                        //we update the "downloaded" counter in DB
                        //comment this if not needed
                        var updateQuery = "update files f set f.downloaded = ? where f.idfiles = ?";
                        request.performQuery(updateQuery, [response[0].downloaded + 1, response[0].idfiles], function (updateresult){
                            if (updateresult === undefined)
                            console.log("Error updating");
                        });
                    }
                });
            } else {
                //in case error is thrown we log the error
                res.json({"res": "File not found"});
            }
        });
    },
    //shows list of downloadable files by pages
    downloadList: function (req, res) {
        var nopage = req.params["nopage"];

        //gets files 10 per pages and returns the result as a list
        if (nopage < 1 ) nopage = 1;
        var start = (nopage - 1) * 10;
        var sql = "select f.description, f.idfiles, f.downloaded, f.date_added, f.available from files f where f.available = 1 limit 10 offset ?";
        request.performQuery(sql, [start], function(response) {
            if (response === undefined || response.length == 0) {
                res.json({"res": "Invalid page number"});
            } else {
                var jsonObj = [];
                if (response.length > 0) {
                    response.forEach(element => {
                        jsonObj.push(element);
                    });
                    res.json(jsonObj);
                }
            }
        });
    },
    //QRcode generator making it easier to send download links
    downloadQR: function (req, res) {
        const generateQR = async text => {
            try {
                res.send("<img src='" + await qrcode.toDataURL(text) + "'/>");
            } catch (err) {
                console.error(err);
            }
        }
        generateQR(ip.address() + "/download/" + req.params["id"]);
    },
    //upload method
    uploadFile: function (req, res) {
        req.pipe(req.busboy);

        //we need to use a stream because post requests are limited to 2gb
        req.busboy.on('file', (fieldname, file, filename) => {
            console.log(`Upload of '${filename}' started`);

            var tsfilename = crypto.randomBytes(10).toString('hex') + "_" + filename;
            const fstream = fs.createWriteStream(path.join(uploadPath, tsfilename));
            file.pipe(fstream);

            fstream.on('close', () => {
                console.log(`Upload of '${filename}' finished`);

                //insert in DB once file has been downloaded into the directory
                var sql = "insert into files (filepath, date_added, description) VALUES (?, ?, ?);";
                request.performQuery(sql, [uploadPath + tsfilename,
                    moment().format('YYYY-MM-DD HH:mm:ss'), filename], function(response) {
                    if (response === undefined)
                        console.log("Error inserting");
                    res.json({"idfiles": response.insertId});
                });
            });
        });
    },
    //delete method
    deleteFile: function (req, res) {
        var idfile = req.params["id"];

        //SQL query to get the file url stored in database
        var sql = "select f.filepath, f.available from files f where f.idfiles = ?";
        request.performQuery(sql, [idfile], function(response) {
            //if response contains a result we delete the file from the upload folder
            if (response !== undefined && response.length > 0 && response[0].available == 1) {
                fs.unlink(response[0].filepath, function (err) {
                    if (err) {
                        res.json({"res": "An error occured. File may be unavailable."});
                    } else {
                        //we update the "available" field in DB
                        var updateQuery = "update files f set f.available = 0 where f.idfiles = ?";
                        request.performQuery(updateQuery, [idfile], function (updateresult){
                            if (updateresult === undefined)
                                console.log("Error updating");
                            res.json({"res": "Success!"});
                        });
                    }
                });
            } else {
                //in case error is thrown we return an error to client
                res.json({"res": "File not found"});
            }
        });
    }
};