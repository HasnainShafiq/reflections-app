require('dotenv').config();

const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');
// require mongo model
const Reflection = require('./models/reflection');
var mongoose = require('mongoose').set('debug', true);;
// used to create PUT and DELETE routes
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError');
// used to add layouts to ejs
const engine = require('ejs-mate')
const session = require('express-session');
const flash = require('connect-flash');
const dbUrl = process.env.DB_URL;
const Joi = require('joi');
const User = require('./models/user');
const passport = require('passport');
const localStrategy = require('passport-local');
const mongoSanitize = require('express-mongo-sanitize');
const SESSION_SECRET  = process.env.SESSION_SECRET;
const helmet = require('helmet');
const MongoStore = require('connect-mongo');
const CONNECT_MONGO_SECRET = process.env.CONNECT_MONGO_SECRET;

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


const store = MongoStore.create({
  mongoUrl: dbUrl,
  touchAfter: 24 * 60 * 60,
  crypto: {
    secret: CONNECT_MONGO_SECRET
  }
})

const sessionConfig = {
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  store,
  cookie: {
    // cookie expires a week from now;
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    // maxAge of cookie is a week;
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
    // secure: true; 
  }
}


app.use(mongoSanitize());

app.use(session(sessionConfig));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


const usersRouter = require('./routes/user');
const reflectionsRouter = require('./routes/reflections');

// enable the use of static files. Access static files relative to this root file.
app.use(express.static(__dirname + '/public'));
// middleware used to parse incoming POST requests from req.body
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(helmet());

app.use(flash());

app.use((req, res, next) => {
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
})

app.engine('ejs', engine);
app.set('view engine', 'ejs');
// set views path relative to this root file + '/views'
app.set('views', path.join(__dirname, 'views'));


// for any routes handled by the reflectionsRouter, give them all a preceding '/reflections'
app.use('/reflections', reflectionsRouter);
app.use('/', usersRouter);


app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
})

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) {
    err.message = 'Oh no, something went wrong!';
  }
  res.status(statusCode).render('error', { err });
})

app.listen('3000', () => {
  console.log('listening on port 3000');
})