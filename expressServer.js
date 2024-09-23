const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
var cors = require("cors");
const app = express();
const port = 3003;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const uri = "mongodb://localhost:27017"; // default mongodb 27017 port number
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// app.get("/", (req, res) => {
//   res.send("Hello World! This is so much better now!");
// });

// app.get("/:id", (req, res) => {
//   console.log("params", req.params);

//   res.send("Hello World! This is so much better now!");
// });

// app.get("/messages/:id", (req, res) => {
//   console.log("params", req.params);

//   res.send("Hello World! This is so much better now!");
// });

// app.post("/travel-destinations", (req, res) => {
//   console.log("body:", req.body);
//   res.send("Hello World! This is so much better now!");
// });

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
