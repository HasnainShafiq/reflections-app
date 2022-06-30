const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
const Reflection = require('./models/reflection');
var mongoose = require('mongoose');
const methodOverride = require('method-override');
const engine = require('ejs-mate')
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

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));

app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



app.get('/reflections', async (req, res) => {
  const reflections = await Reflection.find({});
  res.render('index', { reflections })
})

app.get('/reflections/new', async (req, res) => {
  const reflection = Reflection;
  res.render('new', { reflection });
})

app.post('/reflections', async (req, res) => {
  const reflection = new Reflection(req.body.reflection);
  await reflection.save();
  res.redirect(`/reflections/${reflection._id}`);
})

app.get('/reflections/:id', async (req, res) => {
  const { id } = req.params;
  const reflection = await Reflection.findById(id);
  res.render('show', { reflection });
})

app.get('/reflections/:id/edit', async (req, res) => {
  const { id } = req.params;
  const reflection = await Reflection.findById(id);
  res.render('edit', { reflection })
})

app.put('/reflections/:id', async (req, res) => {
  const { id } = req.params;
  // update reflection with new changes made in any elements with name = 'reflection'.
  const reflection = await Reflection.findByIdAndUpdate(id, {...req.body.reflection}, { runValidators: true, new: true});
  console.log(req.body);
  res.redirect(`/reflections/${reflection._id}`);
})

app.delete('/reflections/:id', async (req, res) => {
  const { id } = req.params;
  await Reflection.findByIdAndDelete(id);
  res.redirect('/reflections');
})

app.listen('3000', () => {
  console.log('listening on port 3000');
})