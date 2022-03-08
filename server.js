// server.js
// where your node app starts

// init project
require("dotenv").config();
var express = require("express");
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC
var cors = require("cors");
app.use(cors({ optionsSuccessStatus: 200 })); // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("public"));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(req, res) {
  res.sendFile(__dirname + "/views/index.html");
});

app.get("/api/:date?", (req, res) => {
  const dateIntoNumber = Number(req.params.date);

  if (req.params.date == null) {
    const date = new Date();
    res.json({ unix: date.getTime(), utc: date.toUTCString() });
  } else {
    if (Number.isNaN(dateIntoNumber)) {
      let date = new Date(req.params.date);
      if (date === "Invalid Date" || date.toUTCString() === "Invalid Date") {
        res.json({ error: "Invalid Date" });
      } else {
        res.json({ unix: date.getTime(), utc: date.toUTCString() });
      }
    } else {
      let date = new Date(dateIntoNumber);
      res.json({ unix: date.getTime(), utc: date.toUTCString() });
    }
  }
  res.json({ error: "Invalid Date" });
});

// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API2" });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
