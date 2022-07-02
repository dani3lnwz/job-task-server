const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqhae.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function  run (){
    try{
        await client.connect();
        const taskCollection = client.db("todo").collection("tasks");

        app.get('/tasks', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        });

        app.patch("/task-complete/:id", async (req, res) => {
            const id = req.params.id;

            const filter = { _id: ObjectId(id) };
            const updateTask = {
                $set: {
                    isComplete: true,
                },
            };
            const result = await taskCollection.updateOne(filter, updateTask);
            console.log(result);
            res.send(result);
        });

         // to add task
         app.post("/add-task", async (req, res) => {
            const { taskName } = req.body;
            let task = {
                taskName: taskName,
                isComplete: false,
            };
            const id = (await taskCollection.insertOne(task)).insertedId;
            if (id) {
                res.send({ success: true, msg: "Task added successfully" });
            }
        });

        app.patch("/edit-task/:id", async(req, res) => {
            const id = req.params.id;

            const { taskName } = req.body;
            const filter = { _id: ObjectId(id) };
            const updateTask = {
                $set: {
                    taskName: taskName,
                },
            };
            const result = await taskCollection.updateOne(filter, updateTask);
            res.send(result);
        });
    }
    
    finally{

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
  res.send('Hello task!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})