const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ReflectionSchema = new schema({
    prompt: {type: String, required: true},
    date: Date,
    body: String,
})

const Reflection = mongoose.model('Reflection', ReflectionSchema);

module.exports = Reflection;
