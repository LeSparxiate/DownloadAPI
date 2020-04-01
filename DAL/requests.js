var config = require("./config");
var connect = config.connect();

module.exports = {
    //perform any query passed as parameter "sql"
    //callback function needed to be able to access query result
    //in the same context
    performQuery: function (sql, params, callback) {
        connect.query(sql, params, function (err, result) {
            if (err) {
                console.log("An error occured during the query.\n" + err);
                callback(undefined);
            }
            callback(result);
        });
    }
};