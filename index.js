const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const app = express();
const port = 3000;

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.json());

app.get("/", (req, res) => {
  const cetTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Europe/Paris', 
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  res.status(200).json("Hello World! " + cetTime);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app; // Export the app for testing purposes
