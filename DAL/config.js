var mysql = require('mysql');

module.exports = {
    //change login/password/database
    connect: function () {
        var con = mysql.createConnection({
            host: "localhost",
            user: "Sparx",
            password: "123456789",
            database: "download_files"
        });
        console.log("Connected to database!");
        return con;
    }
};