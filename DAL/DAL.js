module.exports = {
    downloadFile: function (req, res, con) {
        var idgen = req.params["id"];

        //SQL query to get the file url stored in database
        var sql = "select f.idfiles, f.filepath, f.downloaded from files f where f.idgen = ?";
        con.query(sql, [idgen], function (err, result) {
            if (err) throw err;

            if (result.length > 0) {
                //we start the download right after we got the result
                res.download(result[0].filepath);

                //we update the "downloaded" counter in DB
                //you can comment this if you don't care
                var updateQuery = "update files f set f.downloaded = ? where f.idfiles = ?"; 
                con.query(updateQuery, [result[0].downloaded + 1, result[0].idfiles], function (err, result) {
                    if (err) {
                        console.log("Error when updating downloaded counter for id " + 
                        result[0].idfiles + "\n" + err);
                    } else {
                        console.log("Update successful");
                    }
                });

            } else {
                console.log("No result");
                res.json({"error": "File not found"});
            }
        });
    }
};