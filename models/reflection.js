const mongoose = require('mongoose');
const schema = mongoose.Schema;

const ReflectionSchema = new schema({
    prompt: String,
    body: String,
})

const Reflection = mongoose.model('Reflection', ReflectionSchema);

module.exports = Reflection;
