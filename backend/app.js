const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Product = require('./models/product');

const app = express();

mongoose.connect('mongodb+srv://babatope:53zH6blCfRaW8813@cluster0-kps2s.mongodb.net/<dbname>?retryWrites=true&w=majority')
    .then(() => {
        console.log('Successfully connected to MongoDB Atlas!');
    })
    .catch(error => {
        console.log('Unable to connect to MongoDB Atlas!');
        console.log(error);
    })


//global middleware
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyParser.json());

//post route/middleware to create new products

app.post('/api/products', (req, res, next) => {
    const product = new Product({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock
    });

    product.save().then(
        (product) => {
            res.status(201).json({ product })
        }
    ).catch(error => {
        res.status(400).json({ error });
    })

});

app.get('/api/products', (req, res, next) => {
    Product.find().then(
        products => {
            res.status(200).json({ products })
        }
    ).catch(error => {
        res.status(400).json({ error })
    })
});

app.get('/api/products/:id', (req, res, next) => {
    Product.findOne({ _id: req.params.id }).then(
        (product) => {
            res.status(200).json({ product })
        }
    ).catch(error => {
        res.status(404).json({ error })
    })
})

app.put('/api/products/:id', (req, res, next) => {
    const product = new Product({
        _id: req.params.id,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        inStock: req.body.inStock
    });
    Product.updateOne({ _id: req.params.id }, product).then(
        () => {
            res.status(201).json({ message: 'Modified!' });
        }
    ).catch(error => {
        res.status(400).json({ error });
    })
});

app.delete('/api/products/:id', (req, res, next)=>{
    Product.deleteOne({_id:req.params.id}).then(
        () => {
            res.status(200).json({message: 'Deleted!'});
        }
    ).catch(error => {
        res.status(400).json({error});
    })
});

module.exports = app;