const express = require('express');
// allows us to create our own routes and export them in a module
const router = express.Router();
// require mongo model
const Reflection = require('../models/reflection');

// on home page, display all posts
router.get('/', async (req, res) => {
    // when performing any database function, must use await.
    const reflections = await Reflection.find({});
    // include reflections as a variable to be used in index.ejs
    res.render('index', { reflections })
})

// no preceding '/reflections'
router.get('/new', async (req, res) => {
    const reflection = Reflection;
    res.render('new', { reflection });
})

// send a request to show a new post to the index page & save to db 
router.post('/', async (req, res) => {
    // req.body.reflection = anything whose name is in format of: reflection[property], e.g. reflection[prompt], which === reflection.prompt
    const reflection = new Reflection(req.body.reflection);
    await reflection.save();
    req.flash('success', 'succesfully created new reflection!');
    res.redirect(`/reflections/${reflection._id}`);
})

// get a specific post
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const reflection = await Reflection.findById(id);
    res.render('show', { reflection });
})

// get edit page for specific post
router.get('/:id/edit', async (req, res) => {
    const { id } = req.params;
    const reflection = await Reflection.findById(id);
    res.render('edit', { reflection })
})


// edit specific post
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    // update reflection with new changes made in any elements with name = 'reflection'.
    const reflection = await Reflection.findByIdAndUpdate(id, { ...req.body.reflection }, { runValidators: true, new: true });
    console.log(req.body);
    req.flash('success', 'succesfully edited reflection!');
    res.redirect(`/reflections/${reflection._id}`);
})

// delete specific post
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Reflection.findByIdAndDelete(id);
    req.flash('success', 'succesfully deleted reflection');
    res.redirect('/reflections');
})

// if none of the above routes are found, send this status code
router.use((req, res) => {
    res.status(404).send("NOT FOUND");
})

module.exports = router;