const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb"); // Import MongoClient, ServerApiVersion, and ObjectId
const express = require("express");
var cors = require("cors");
const messagesApi = require("./api/messagesApi.js");

const app = express();
const port = 3003;
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.use("/messages", messagesApi);

app.post("/destinations", async (req, res) => {
  createDestination(req.body);
  console.log("body:", req.body);
  res.send("Post request sent");
});

app.get("/destinations", (req, res) => {
  getDestinations();
  res.send("Getting all destinations");
});
app.get("/destinations/:id", (req, res) => {
  console.log("params", req.params);
  res.send("Getting destination by id");
});

app.delete("/destinations/:id", (req, res) => {
  deleteDestination(req.params.id);
  res.send("Deletting destination");
});

async function createDestination(newDestination) {
  try {
    await client.connect(); // Connect to MongoDB
    const myDB = client.db("travelDestinations"); // Select the database
    const myColl = myDB.collection("destinations"); // Select the collection

    // Insert the document and wait for the result
    const result = await myColl.insertOne(newDestination);

    console.log(`A document was inserted with the _id: ${result.insertedId}`);

    // Send response back to the client
    res.send("Document inserted successfully!");
  } catch (error) {
    console.error("Error inserting document:", error);
    res.status(500).send("Error inserting document");
  } finally {
    await client.close(); // Close the connection after the operation is complete
  }
}

async function getDestinations() {
  try {
    await client.connect();
    const myDB = client.db("travelDestinations"); // Select the database
    const myColl = myDB.collection("destinations"); // Select the collection
    const result = await myColl.find().toArray();
    console.log(result);
    return result;
  } finally {
    await client.close();
  }
}

async function deleteDestination(destinationId) {
  try {
    await client.connect();
    const myDB = client.db("travelDestinations"); // Select the database
    const myColl = myDB.collection("destinations"); // Select the collection}
    const result = await myColl.deleteOne({ _id: new ObjectId(destinationId) });
    if (result.deletedCount === 1) {
      console.log(`Destination ${destinationId} deleted`);
    } else {
      console.log(`Destination ${destinationId} not found`);
    }
  } finally {
    await client.close();
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
