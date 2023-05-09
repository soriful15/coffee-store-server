const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 4001;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
// middleware
app.use(cors());
app.use(express.json());
// console.log(process.env.DB_USER)
// console.log(process.env.SECRET_KEY)

// mongodb
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.SECRET_KEY}@cluster0.uwuwq9x.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri)

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("coffeesDB");
        const coffeesCollection = database.collection("coffees");


        // app get 
        app.get('/coffees', async (req, res) => {
            const cursor = coffeesCollection.find()
            const result = await cursor.toArray()
            res.send(result)
        })
        // get post
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            // console.log('new coffee', newCoffee)
            const result = await coffeesCollection.insertOne(newCoffee)
            res.send(result)
        })

        // get delete
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await coffeesCollection.deleteOne(query)
            res.send(result)
        })

        // app get dhara id
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const coffee = await coffeesCollection.findOne(query)
            res.send(coffee)
        })


        // app get put mane update
        app.put('/coffees/:id', async (req, res) => {
            const id = req.params.id
            const updateCoffee = req.body
            console.log(updateCoffee)
            const filter = { _id: new ObjectId(id) };
            const option = { upsert: true };
            const updateDoc = {
                $set: {
                    name: updateCoffee.name,
                    quantity: updateCoffee.quantity,
                    supplier: updateCoffee.supplier,
                    taste: updateCoffee.taste,
                    category: updateCoffee.category,
                    details: updateCoffee.details,
                    photo: updateCoffee.photo,
                }
            }
            const result = await coffeesCollection.updateOne(filter, updateDoc, option)
            res.send(result)
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {
    res.send('Coffee making server is running')
})

app.listen(port, () => {
    console.log(`Coffee server is running on port ${port}`)
})