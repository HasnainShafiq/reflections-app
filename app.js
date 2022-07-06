const express = require('express');
const app = express();
const path = require('path');
/* const morgan = require('morgan'); */
// require mongo model
const Reflection = require('./models/reflection');
var mongoose = require('mongoose');
// used to create PUT and DELETE routes
const methodOverride = require('method-override');
// used to add layouts to ejs
const engine = require('ejs-mate')
// config file for mongo atlas
const config = require("./config");
const dbUrl = config.dbUrl;

// connect to mongo atlas using the given url
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

// enable the use of static files. Access static files relative to this root file.
app.use(express.static(__dirname + '/public'));
// middleware used to parse incoming POST requests from req.body
app.use(express.urlencoded({extended: true})); 
app.use(methodOverride('_method'));


app.engine('ejs', engine);
app.set('view engine', 'ejs');
// set views path relative to this root file + '/views'
app.set('views', path.join(__dirname, 'views'));


// on home page, display all posts
app.get('/reflection', async (req, res) => {
  // when performing any database function, must use await.
  const reflections = await Reflection.find({});
                    // include reflections as a variable to be used in index.ejs
  res.render('index', { reflections })
})


app.get('/reflection/new', async (req, res) => {
  const reflection = Reflection;
  res.render('new', { reflection });
})

// send a request to show a new post to the index page & save to db 
app.post('/reflection', async (req, res) => {
  // req.body.reflection = anything whose name is in format of: reflection[property], e.g. reflection[prompt], which === reflection.prompt
  const reflection = new Reflection(req.body.reflection);
  await reflection.save();
  res.redirect(`/reflection/${reflection._id}`);
})

// get a specific post
app.get('/reflection/:id', async (req, res) => {
  const { id } = req.params;
  const reflection = await Reflection.findById(id);
  res.render('show', { reflection });
})

// get edit page for specific post
app.get('/reflection/:id/edit', async (req, res) => {
  const { id } = req.params;
  const reflection = await Reflection.findById(id);
  res.render('edit', { reflection })
})


// edit specific post
app.put('/reflection/:id', async (req, res) => {
  const { id } = req.params;
  // update reflection with new changes made in any elements with name = 'reflection'.
  const reflection = await Reflection.findByIdAndUpdate(id, {...req.body.reflection}, { runValidators: true, new: true});
  console.log(req.body);
  res.redirect(`/reflection/${reflection._id}`);
})

// delete specific post
app.delete('/reflection/:id', async (req, res) => {
  const { id } = req.params;
  await Reflection.findByIdAndDelete(id);
  res.redirect('/reflection');
})

// if none of the above routes are found, send this status code
app.use((req, res) => {
  res.status(404).send("NOT FOUND");
})

app.listen('3000', () => {
  console.log('listening on port 3000');
})