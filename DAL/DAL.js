var request = require("./requests");
var qrcode = require("qrcode");
var ip = require("ip");

module.exports = {
    //start the download of the file specified in ID
    downloadFile: function (req, res) {
        var idgen = req.params["id"];

        //SQL query to get the file url stored in database
        var sql = "select f.idfiles, f.filepath, f.downloaded, f.available from files f where f.idgen = ?";
        request.performQuery(sql, [idgen], function(response) {
            //if response contains a result we start the download for client
            if (response !== undefined && response.length > 0 && response[0].available == 1) {
                res.download(response[0].filepath, function (err) {
                    if (err) {
                        res.json({"error": "An error occured during download. File may be unavailable."});
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
                //in case error is thrown we return an error to client
                res.json({"error": "File not found"});
            }
        });
    },
    //shows list of downloadable files by pages
    downloadList: function (req, res) {
        var nopage = req.params["nopage"];

        //gets files 10 per pages and returns the result as a list
        var start = (nopage - 1) * 10;
        var sql = "select * from files f limit 10 offset ?";
        request.performQuery(sql, [start], function(response) {
            if (response === undefined || response.length == 0) {
                res.json({"error": "Invalid page number"});
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
    }
};