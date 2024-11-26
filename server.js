const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.listen(port);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s7kzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const studentsRouter = express.Router();
app.use("/students", studentsRouter);

studentsRouter.route("/").get(showStudents).post(createStudent);
studentsRouter
  .route("/:uid")
  .get(showSingleStudent)
  .delete(studentDelete)
  .patch(studentUpdate);

async function run() {
  try {
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    return client.db("studentsDB").collection("students");
  } catch (err) {
    console.log(err);
  }
}

async function showStudents(req, res) {
  const studentCollection = await run();
  const result = await studentCollection.find().toArray();
  res.send(result);
}
async function createStudent(req, res) {
  const studentData = req.body;
  console.log(studentData);
  const studentCollection = await run();
  const result = await studentCollection.insertOne(studentData);
  res.send(result);
}
async function showSingleStudent(req, res) {
  const id = req.params.uid;
  const studentCollection = await run();
  const quary = { id: parseInt(id) };
  console.log(quary);

  const result = await studentCollection.findOne(quary);
  res.send(result);
  console.log(result);
}
async function studentDelete(req, res) {
  const id = req.params.uid;
  console.log(id);

  const studentCollection = await run();
  // const quary = { _id: new ObjectId(id) };
  const quary = { id: parseInt(id) };
  console.log(quary);
  const result = await studentCollection.deleteOne(quary);

  res.send(result);
}
async function studentUpdate(req, res) {
  const id = req.params.uid;
  const data = req.body;
  console.log("79", data);
  // delete data._id;
  const studentCollection = await run();
  const filter = { id: parseInt(id) };
  const updateData = {
    $set: data,
  };
  const result = studentCollection.updateOne(filter, updateData);

  // const result = await studentCollection.deleteOne(quary);

  res.send(data);
}
