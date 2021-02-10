const MySqli = require("mysqli");

let conn = new MySqli({
  Host: "localhost", //IP/Domain name
  post: 3306, //port , default 3306
  user: "root", //username
  passwd: "1234", //password
  db: "ecommerce",
});

let db = conn.emit(false, "");

module.exports = {
  database: db,
};
