const express = require("express");
const favicon = require("serve-favicon");
const path = require("path");
const apiKeyAuth = require("./middleware/apiKeyAuth");
const { db } = require("./firebaseAdmin");
const { MongoClient, ServerApiVersion } = require("mongodb");
process.loadEnvFile();

const uri = `mongodb+srv://automatedaquariumiot:${process.env.MONGO_DB_PW}@automatedaquariumcluste.jk2ia54.mongodb.net/?retryWrites=true&w=majority&appName=AutomatedAquariumCluster`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const myColl = client.db("AutomatedAquarium").collection("FishFeeder");

async function writeMongoData(data) {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("AutomatedAquarium").command({ ping: 1 });
  
    const result = await myColl.insertOne(data);
    console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

const app = express();
const port = 3000;

let fishFeederData = {
  schedule0Enabled: true,
  feednow: false,
  schedule2Enabled: false,
  schedule2: "00:00",
  schedule1Enabled: false,
  schedule0: "15:48",
  schedule1: "00:00",
  count: 13,
  waterTemperature: 13.62842,
};

app.use(apiKeyAuth);
app.use(favicon(path.join(__dirname, "public", "favicon.ico")));
app.use(express.json());

const doc = db.collection("fishFeeder");

doc.onSnapshot(
  (docSnapshot) => {
    console.log("\nCollection snapshot received.");
    docSnapshot.forEach((doc) => {
      // console.log(`${doc.id} =>`, doc.data());
      fishFeederData = doc.data();

      for (let [key, value] of Object.entries(doc.data())) {
        // console.log(`${key}: ${value}`);
      }

      const cetDate = new Date().toLocaleString("es-ES", { timeZone: "CET" });
      Object.assign(fishFeederData, { timestamp: cetDate });

      // Write to MongoDB
      writeMongoData(fishFeederData)
        .then(() => {
          console.log("Data written to MongoDB successfully.");
        })
        .catch((error) => {
          console.error("Error writing data to MongoDB:", error);
        });
    });
  },
  (err) => {
    console.log(`Encountered error: ${err}`);
  }
);

app.get("/fishFeeder", (req, res) => {
  console.log("GET /fishFeeder" + req.url);
  res.json(fishFeederData);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

module.exports = app; // Export the app for testing purposes
