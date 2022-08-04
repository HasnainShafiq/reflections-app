const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const User = require('./user');

const reflectionSchema = new Schema({
    prompt: {
        type: String,
    },
    body: {
        type: String,
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

const Reflection = mongoose.model('Reflection', reflectionSchema);

module.exports = Reflection;



/* makeReflection = async () => {
const reflection = new Reflection({ prompt: 'How was your day?', body: 'It was good!!!!!!!!!' })
const user = new User({ email: 'lollypop@outlook.com' });
reflection.user = user;
await reflection.save();
console.log(reflection);
} 
 
makeReflection(); 

Reflection.findOne({ prompt: 'How was your day?' })
.populate('user')
.then(ref => console.log(ref)); 

 */