const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const apiKeyAuth = require('./middleware/apiKeyAuth');
const { db } = require("./firebaseAdmin");

const app = express();
const port = 3000;

let fishFeederData = {};

app.use(apiKeyAuth)
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.json());

const doc = db.collection('fishFeeder')

doc.onSnapshot(
  (docSnapshot) => {
    console.log("Collection snapshot received.");
    docSnapshot.forEach((doc) => {
      // console.log(`${doc.id} =>`, doc.data());
      fishFeederData = doc.data();

      for (let [key, value] of Object.entries(doc.data())) {
        console.log(`${key}: ${value}`);
      }
    });
  },
  (err) => {
    console.log(`Encountered error: ${err}`);
  }
);

app.get("/fishFeeder", (req, res) => {
  console.log("GET /fishFeeder");
  res.json(fishFeederData);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app; // Export the app for testing purposes
