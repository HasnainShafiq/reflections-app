const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const Reflection = require('./models/reflection');
var mongoose = require('mongoose');
const methodOverride = require('method-override');

const config = require("./config");
const dbUrl = config.dbUrl;

mongoose.connect(dbUrl)
.then(res => {
  console.log("Connected with Mongoose!")
})
.catch(err => {
  console.log("MONGOOSE ERROR");
})

var db = mongoose.connection;
db.on('error', console.error.bind(console, "connection error:"));
db.once('open', () => {
    console.log("database connected");
})


app.use(express.urlencoded({extended: true})); 


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
  const reflections = await Reflection.find({});
  res.render('index', { reflections })
})

app.get('/new', async (req, res) => {
  res.render('new');
})

app.post('/', async (req, res) => {
  const reflection = new Reflection(req.body.reflection);
  await reflection.save();
  res.redirect(`/`)
})

app.get('/:id', async (req, res) => {
  const { id } = req.params;
  const reflection = await Reflection.findById(id);
  res.render('show', { reflection });
})

app.listen('3000', () => {
  console.log('listening on port 3000');
})