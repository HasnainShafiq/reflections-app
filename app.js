const express = require('express');
const app = express();
const path = require('path');
/* const morgan = require('morgan'); */
// require mongo model
const Reflection = require('./models/reflection');
const reflectionsRouter = require('./routes/reflections');
var mongoose = require('mongoose');
// used to create PUT and DELETE routes
const methodOverride = require('method-override');
// used to add layouts to ejs
const engine = require('ejs-mate')
const session = require('express-session');
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

const sessionConfig = {
  secret: 'thisismysecret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  }
}

app.use(session(sessionConfig));

// for any routes handled by the reflectionsRouter, give them all a preceding '/reflections'
app.use('/reflections', reflectionsRouter);

app.engine('ejs', engine);
app.set('view engine', 'ejs');
// set views path relative to this root file + '/views'
app.set('views', path.join(__dirname, 'views'));

app.listen('3000', () => {
  console.log('listening on port 3000');
})