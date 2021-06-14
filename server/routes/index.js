const express = require("express");
const app = express();
const controllers = require("../controllers/index");

app.get("/api/items", [controllers.getItems]);

app.get("/api/items/:id", [controllers.getById]);

module.exports = app;
