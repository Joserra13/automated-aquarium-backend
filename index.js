const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const apiKeyAuth = require('./middleware/apiKeyAuth');
const { db } = require("./firebaseAdmin");

const app = express();
const port = 3000;


  let fishFeederData = {
    "schedule0Enabled": true,
    "feednow": false,
    "schedule2Enabled": false,
    "schedule2": "00:00",
    "schedule1Enabled": false,
    "schedule0": "15:48",
    "schedule1": "00:00",
    "count": 13,
    "waterTemperature": 13.62842
  }

    // console.log("Collection snapshot received.");
    docSnapshot.forEach((doc) => {
      // console.log(`${doc.id} =>`, doc.data());
      fishFeederData = doc.data();

      for (let [key, value] of Object.entries(doc.data())) {
        // console.log(`${key}: ${value}`);
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
