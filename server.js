// server.js
// where your node app starts

// init project
require("dotenv").config();
var express = require("express");
var app = express();

// functions
function validateDate(year, month, day) {
  let isValid = false;
  const shortMonths = ["02", "04", "06", "09", "11", "2", "4", "6", "9"];
  const longMonths = ["01", "03", "05", "07", "10", "12", "1", "3", "5", "7"];

  if (month > 12) {
    // not a valid month
    // isValid stays equal to 'false'
  } else {
    if (shortMonths.includes(month)) {
      // if the month has at most 30 days
      if (day < 31) {
        isValid = true;
      } else {
        // isValid stays equal to 'false'
      }
    } else if (longMonths.includes(month)) {
      // if the month has at most 31 days
      if (day < 32) {
        isValid = true;
      } else {
        // isValid stays equal to 'false'
      }
    } else {
      // error. should never happen
    }
  }
  return isValid;
}
function validateDateRoute(path) {
  const pathArray = path.split("/");
  const dateString = pathArray[pathArray.length - 1];
  const dateArray = dateString.split("-");
  let dateObj = {
    year: null,
    month: null,
    day: null,
    unix: null,
    error: null
  };

  if (dateArray.length === 3) {
    dateObj.year = dateArray[0];
    dateObj.month = dateArray[1];
    dateObj.day = dateArray[2];

    if (validateDate(dateObj.year, dateObj.month, dateObj.day) === true) {
      // the dates are valid
    } else {
      // the date is not valid
      dateObj.error = "Invalid Date";
    }
  } else if (dateArray.length === 1) {
    dateObj.unix = parseInt(dateArray[0]);
  } else {
    // error
  }
  return dateObj;
}

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

// hostname/api/YEAR-MONTH-DAY
app.get(/^\/api\/\d{4}-\d{1,2}-\d{1,2}\/?$/, (req, res) => {
  const dateInPath = validateDateRoute(req.path);
  const date = new Date(
    dateInPath.year,
    dateInPath.month - 1,
    dateInPath.day,
    0,
    0,
    0,
    0
  );
  if (dateInPath.error == null) {
    res.json({ unix: date.getTime(), utc: date.toUTCString() });
  } else {
    res.json({ error: dateInPath.error });
  }
});

// hostname/api/UNIX_TIMESTAMP
app.get(/^\/api\/[1-9][0-9]{1,}\/?$/, (req, res) => {
  const dateInPath = validateDateRoute(req.path);
  const date = new Date(dateInPath.unix);

  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});

app.get("/api", (req, res) => {
  const date = new Date();

  res.json({ unix: date.getTime(), utc: date.toUTCString() });
});
// your first API endpoint...
app.get("/api/hello", function(req, res) {
  res.json({ greeting: "hello API2" });
});

// listen for requests :)
var listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
