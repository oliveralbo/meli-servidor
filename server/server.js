const express = require("express");
const app = express();
bodyParser = require("body-parser");
var cors = require('cors')

 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors())



app.use(require('./routes/index'))




app.listen(process.env.PORT || 5000, () => console.log('\x1b[33m%s\x1b[0m', `escuchando puerto  ${process.env.PORT ? process.env.PORT : 5000}`   ));

