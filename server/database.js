const mysql = require("mysql");

var config = {
  host: "localhost",
  user: "root",
  password: "",
  database: "icomdatabase",
};

const db = new mysql.createConnection(config);

function GetUserFromDataBase(email, password) {
  // create DataBase Connection

  return new Promise((resolve, reject) => {
    db.query(
      "SELECT * FROM IUsers WHERE email = ? AND password = ?",
      [email, password],
      (err, result) => {
        if (err) {
          return reject(err);
        }
        //console.log(result[0].Name);
        return resolve(result);
      }
    );
  });
}

function GetUserByID(userId) {
    // create DataBase Connection
  
    return new Promise((resolve, reject) => {
      db.query(
        "SELECT * FROM IUsers WHERE userId = ?",
        [userId],
        (err, result) => {
          if (err) {
            return reject(err);
          }
          return resolve(result);
        }
      );
    });
  }

module.exports = {
  GetUserFromDataBase,
  GetUserByID,
};
