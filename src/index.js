////////////////Modulo de compras////////////////

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
require("./controller/controllerCompra")(app);
app.listen(3001, () => {
  console.log("Server esta ativo na porta ==> 3001!");
});
