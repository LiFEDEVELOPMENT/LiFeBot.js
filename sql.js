const mysql = require('mysql');
const fs = require('fs')

const connection;

function connect() {
connection = mysql.createConnection({
  host: 'localhost',
  database: 'LiFeDB.db'
});

connection.connectDB();
}

function disconnect() {
  connection.end();
}

export function query(sql) {
  return connection.query(sql, function (err, result) {
    if(err) throw err;
    return result
  })
}