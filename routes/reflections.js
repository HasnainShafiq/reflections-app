const express = require('express');
// allows us to create our own routes and export them in a module
const router = express.Router();
// require mongo model
const Reflection = require('../models/reflection');
// require middleware to check user is logged in
const { isLoggedIn } = require('../middleware');
// require reflection joi schema validation
const { reflectionSchema } = require('../utils/schemas');
// require Error model
const ExpressError = require('../utils/ExpressError');
// require catchAsync
const catchAsync = require('../utils/catchAsync');
// require user model
const User = require('../models/user');

const { isUser } = require('../utils/isUser');


const validateReflection = (req, res, next) => {
    const { error } = reflectionSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

// on home page, display all posts
router.get('/', isLoggedIn, catchAsync(async (req, res) => {
    // find all reflections belonging to the current user
    const reflections = await Reflection.find({ user: req.user._id });
    // include reflections as a variable to be used in index.ejs
    res.render('reflections/index', { reflections })

}))

// no preceding '/reflections'
router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    const reflection = Reflection;
    res.render('reflections/new', { reflection });
}))

// send a request to show a new post to the index page & save to db 
router.post('/', isLoggedIn, validateReflection, catchAsync(async (req, res) => {
    // req.body.reflection = anything whose name is in format of: reflection[property], e.g. reflection[prompt], which === reflection.prompt
    const reflection = new Reflection(req.body.reflection);
    // assign currentUser's id to 'userId' variable
    const userId = req.user._id;
    // grab current user using 'userId'
    const user = await User.findById(userId);
    reflection.user = user;
    await reflection.save();
    // add reflection to array of reflections for current user
    user.reflections.push(reflection);
    await user.save();
/*     if (validateReflection) {
        req.flash('error', 'reflection cannot be empty');
        return res.redirect('/new');
    } */
    req.flash('success', 'succesfully created new reflection!');
    res.redirect(`/reflections/${reflection._id}`);
}))

// get a specific post
router.get('/:id', isLoggedIn, isUser, catchAsync(async (req, res) => {
    // grab current reflection using its id
    const { id } = req.params;
    const reflection = await Reflection.findById(id);
    if (!reflection.user.equals(req.user._id)) {
        req.flash('error', 'you do not have permission for that')
        return res.redirect('/reflections');
    }
    res.render('reflections/show', { reflection });
}))

// get edit page for specific post
router.get('/:id/edit', isLoggedIn, isUser, catchAsync(async (req, res) => {
    const { id } = req.params;
    const reflection = await Reflection.findById(id);
    if (!reflection.user.equals(req.user._id)) {
        req.flash('error', 'you do not have permission for that')
        return res.redirect('/reflections');
    }
    res.render('reflections/edit', { reflection })
}))


// edit specific post
router.put('/:id', isLoggedIn, isUser, validateReflection, catchAsync(async (req, res) => {
    const { id } = req.params;
    // update reflection with new changes made in any elements with name = 'reflection'.
    const reflection = await Reflection.findByIdAndUpdate(id, { ...req.body.reflection }, { runValidators: true, new: true });
    console.log(req.body);
    req.flash('success', 'succesfully edited reflection!');
    res.redirect(`/reflections/${reflection._id}`);
}))

// delete specific post
router.delete('/:id', isLoggedIn, isUser, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Reflection.findByIdAndDelete(id);
    req.flash('success', 'succesfully deleted reflection');
    res.redirect('/reflections');
}))

// if none of the above routes are found, send this status code
router.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) {
        err.message = 'Oh no, something went wrong!';
    }
    res.status(statusCode).render('error', { err });
})

module.exports = router;