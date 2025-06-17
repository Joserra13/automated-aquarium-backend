const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");

const { db } = require("./firebaseAdmin");

const app = express();
const port = 3000;

let data;

app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.json());

// async function fetchFishFeederData() {
//   try {
//     const fishFeederCollection = db.collection("fishFeeder");
//     const snapshot = await fishFeederCollection.get();
//     const data = [];
//     snapshot.forEach((doc) => {
//       data.push({ id: doc.id, ...doc.data() });
//     });
//     return data;
//   } catch (error) {
//     console.error("Error fetching fish feeder data:", error);
//     throw error;
//   }
// }

const doc = db.collection('fishFeeder')

const observer = doc.onSnapshot(docSnapshot => {
  console.log("📦 Collection snapshot received.");
  docSnapshot.forEach(doc => {
    data = doc.data();
    console.log(`${doc.id} =>`, doc.data());
  });

}, err => {
  console.log(`Encountered error: ${err}`);
});

app.get("/", (req, res) => {
  // fetchFishFeederData()
  //   .then((data) => {
  //     console.log("Fish Feeder Data:", data);
  //     res.status(200).json(data);
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //     res.status(500).json({ error: 'Failed to fetch data' });
  //   });

  res.status(200).json(data);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app; // Export the app for testing purposes
