const {createPool } = require("mysql");


exports.pool = createPool({
    host:"localhost",
    port:3306,
   user:"root",
   password:"",
   database:"mocktest",
    // connectionLimit: 25
});