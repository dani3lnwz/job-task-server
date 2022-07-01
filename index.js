const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pqhae.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function  run (){
    try{
        await client.connect();
        const tasksToDoCollection = client
            .db("TaskManagerDB")
            .collection("Tasks_TODO");

            app.post("/add-task", async(req, res) => {
                const { TaskTitle } = req.body;
                let task = {
                    TaskTitle: TaskTitle,
                    isComplete: false,
                };
                const id = (await tasksToDoCollection.insertOne(task)).insertedId;
                if (id) {
                    res.send({ success: true, msg: "Task added successfully" });
                }
            });

            app.patch("/task-complete/:id", async(req, res) => {
                const id = req.params.id;
                // const query = { _id: ObjectId(id) };
                console.log(id);
    
                const filter = { _id: ObjectId(id) };
                const updateTask = {
                    $set: {
                        isComplete: true,
                    },
                };
                const result = await tasksToDoCollection.updateOne(filter, updateTask);
                console.log(result);
                res.send(result);
            });
            
            app.patch("/edit-task/:id", async(req, res) => {
                const id = req.params.id;
    
                const { TaskTitle } = req.body;
    
                const filter = { _id: ObjectId(id) };
                const updateTask = {
                    $set: {
                        isComplete: true,
                    },
                };
                const result = await tasksToDoCollection.updateOne(filter, updateTask);
                console.log(result);
                res.send(result);
            });
    
            app.get("/getTasksToDo", async(req, res) => {
                const query = {};
                const cursor = tasksToDoCollection.find(query);
                const tasks = await cursor.toArray();
                res.send(tasks);
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