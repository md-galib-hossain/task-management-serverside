const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
require("dotenv").config();
const cors = require("cors");
const port = process.env.PORt || 5000;
// middleware
app.use(cors());
app.use(express.json());
console.log(process.env.DB_USER);

// connect database

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.fkxltzv.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const mytasksCollection = client.db("taskmanager").collection("mytasks");

    // Load advertised
    app.get("/alltasks", async (req, res) => {
      const id = parseInt(req.params.id);
      const query = {
        //  $and: [{ isadvertised: "yes" }, { ispaid: "no" }]
      };
      const tasks = await mytasksCollection.find(query).toArray();
      res.send(tasks);
    });
    // load tasks by query email
    app.get("/mytasks", async (req, res) => {
      const email = req.query.email;

      const query = { email: email };
      console.log(query);
      const tasks = await mytasksCollection.find(query).toArray();
      res.send(tasks);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
//

app.listen(port, () => {
  console.log("server running on port:", port);
});
