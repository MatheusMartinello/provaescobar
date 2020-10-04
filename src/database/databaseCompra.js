const Pool = require("pg").Pool;

//configuracao para conectao banco

const pool = new Pool({
  user: "postgres",
  password: "admin",
  host: "localhost",
  port: "5432",
  database: "postgres",
});

module.exports = pool;
