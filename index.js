const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware used
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@laptopshop.fr8hv.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


async function run() {
    try {
        await client.connect();
        const database = client.db('laptopshop');
        const productsCollection = database.collection('products');
        const usersCollection = database.collection('users');
        const ordersCollection = database.collection('orders');
        const reviewsCollection = database.collection('reviews');
        const branchesCollection = database.collection('branches');
      

        //GET API
        app.get('/products', async (req, res) => {
           
            const cursor = productsCollection.find({}).limit(3);
          
            const result = await cursor.toArray();
           
            res.json(result);
        });

        app.get('/reviews', async (req, res) => {
           
            const cursor = reviewsCollection.find({});
          
            const result = await cursor.toArray();
           
            res.json(result);
        });

        app.get('/branches', async (req, res) => {
           
            const cursor = branchesCollection.find({});
          
            const result = await cursor.toArray();
           
            res.json(result);
        });

        

        app.get('/allProducts', async (req, res) => {
           
            const cursor = productsCollection.find({});
          
            const result = await cursor.toArray();
           
            res.json(result);
        });

        app.get('/allOrders', async (req, res) => {
          
            const cursor = ordersCollection.find({});
          
            const result = await cursor.toArray();
           
            res.json(result);
        });

        app.get('/orders/:email', async (req, res) => {
        
            const uEmail = req.params.email; 
            const query = {email:uEmail }
            const cursor = ordersCollection.find(query);
            const result = await cursor.toArray() ;
            res.json(result);
        });

        app.get('/users/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
             let isAdmin = false;
             if(user == null){
                isAdmin = false
             }else{
             if (user.role!= null && user.role === 'admin') {
               isAdmin = true;
            }
        }
            res.json({ admin: isAdmin });
        })

        // POST API

        app.post('/users', async (req, res) => {
            const user = req.body;
            user.role='user'
            const result = await usersCollection.insertOne(user);
            res.json(result);
        });

        app.post('/products', async (req, res) => {
            const product = req.body;
            const result = await productsCollection.insertOne(product);
            res.json(result);
        });

        app.post('/reviews', async (req, res) => {
            const review = req.body;
            const result = await reviewsCollection.insertOne(review);
            res.json(result);
        });

        app.post('/branches', async (req, res) => {
            const branch = req.body;
            const result = await branchesCollection.insertOne(branch);
            res.json(result);
        });


        app.post('/orders', async (req, res) => {
            const order = req.body;
            const result = await ordersCollection.insertOne(order);
            res.json(result);
        });

        app.put('/users/admin', async (req, res) => {
            const user = req.body;
          
            const filter = { email: user.email };
            const updateDoc = { $set: { role: 'admin' } };
            const result = await usersCollection.updateOne(filter, updateDoc);
            res.json(result);
        })




        
        app.put('/orders/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const options = { upsert: true };
            const updateDoc = { $set: {status :'shipped'} };
            const result = await ordersCollection.updateOne(filter, updateDoc, options);
            res.json(result);
        });


        // DELETE API
        app.delete('/orders/:id', async (req, res) => {
            const id = req.params.id;
            
            const query = { _id: ObjectId(id) };
            const result = await ordersCollection.deleteOne(query);
            res.json(result);
        })

    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running eagle-laptop Server');
});

app.get('/hello', (req, res) => {
    res.send('hello updated here')
})

app.listen(port, () => {
    console.log('Running eagle Laptop Server on port', port);
})