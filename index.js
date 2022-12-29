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
      // const query = {
      //    $and: [{ isadvertised: "yes" }, { ispaid: "no" }]
      // };
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

    // Load single tasks
    app.get("/mytasks/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const query = { _id: ObjectId(id) };

      const singletask = await mytasksCollection.findOne(query);

      res.send(singletask);
    });
    // update task
    app.put("/updatetask/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      console.log(filter);
      const task = req.body;

      const newdetails = task.details;

      const updatedtask = {
        $set: {
          details: newdetails,
        },
      };
      const result = await mytasksCollection.updateOne(filter, updatedtask);
      res.send(result);
    });

    // load completed tasks

    app.get("/completedtasks", async (req, res) => {
      const email = req.query.email;

      const query = {
        $and: [{ email: email }, { iscompleted: "yes" }],
      };
      console.log(query);
      const tasks = await mytasksCollection.find(query).toArray();
      res.send(tasks);
    });
    // not completed
    // update task
    app.put("/notcompletedtasks/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      console.log(filter);
      const task = req.body;

      const updatedtask = {
        $set: {
          iscompleted: "no",
        },
      };
      const result = await mytasksCollection.updateOne(filter, updatedtask);
      res.send(result);
    });
    // make complete task
    // load completed tasks

    app.put("/completedtasks/:id", async (req, res) => {
      const id = req.params.id;

      const filter = { _id: ObjectId(id) };
      const updatedtask = {
        $set: {
          iscompleted: "yes",
        },
      };
      const result = await mytasksCollection.updateOne(filter, updatedtask);
      res.send(result);
    });
    // delete task

    app.delete("/delete/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await mytasksCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
  }
}
run().catch((err) => console.log(err));
//

app.listen(port, () => {
  console.log("server running on port:", port);
});
