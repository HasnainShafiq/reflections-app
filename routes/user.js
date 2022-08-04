const express = require('express');
const passport  = require('passport');
const router = express.Router();
const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async(req, res) => {
    try {
        // take username, email, and pass from req.body
        const { username, email, password } = req.body;
        // create new instance of User using the above username and email
        const user = new User({ username, email });
        // using passport, save the user with username and password to db, and salt and hash their password.
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, (err) => {
            if (err) return next(err);
            console.log(registeredUser);
            req.flash('success', 'Welcome to Reflections!')
            res.redirect('/reflections');
        });
    }
    // if there is an error, like the user is already registered, flash error message at them.
    catch (error) {
        req.flash('error', error.message);
        res.redirect('/register');
    }
}));

router.get('/login', (req, res) => {
    res.render('users/login');
})

// login using local login. If failure, flash an error and redirect to /login
router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }), (req, res) => {
    try {
        req.flash('success', 'succesfully logged in!');
        res.redirect('/reflections');
    }
    catch(error) {
        req.flash('error', 'incorrect username or password');
        res.redirect('/login')
    }
})

router.get('/logout', (req, res) => {
    req.logout(function(err) {
    if (err) { return next(err); }
    req.flash('success', 'successfully logged out');
    res.redirect('/login');
});
})

module.exports = router;