const path = require('path');
const express = require('express');
const OS = require('os');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '/')));
app.use(cors());

// ✅ Corrected mongoose.connect syntax
mongoose.connect('mongodb+srv://supercluster.d83jj.mongodb.net/superData', {
    user: 'superuser',
    pass: 'SuperPassword',
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err) {
    if (err) {
        console.log("Error: " + err);
    } else {
        // console.log("MongoDB Connection Successful");
    }
});

const Schema = mongoose.Schema;

const dataSchema = new Schema({
    name: String,
    id: Number,
    description: String,
    image: String,
    velocity: String,
    distance: String
});

const planetModel = mongoose.model('planets', dataSchema);

app.post('/planet', function (req, res) {
    planetModel.findOne({ id: req.body.id }, function (err, planetData) {
        if (err) {
            console.log("Error retrieving planet data");
            res.status(500).send("Error retrieving planet data");
        } else {
            res.send(planetData);
        }
    });
});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '/', 'index.html'));
});

app.get('/os', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({
        os: OS.hostname(),
        env: process.env.NODE_ENV || 'development'
    });
});

app.get('/live', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: "live" });
});

app.get('/ready', function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: "ready" });
});

app.listen(3000, () => {
    console.log("Server successfully running on port 3000");
});

module.exports = app;
