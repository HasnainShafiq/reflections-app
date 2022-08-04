const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Reflection = require('./reflection');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    reflections: [{
        type: Schema.Types.ObjectId,
        ref: 'Reflection'
    }]
})

// for work on deleting associated reflections from deleted user (WIP)
/* userSchema.post('findOneAndDelete', async (user) => {
    if (user.reflections.length) {
        const res = await Reflection.deleteMany({ _id: { $in: user.reflections }});
        console.log(res);
    }
}) */

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports = User;

/* makeUser = async () => {
    const user = new User({ email: 'lol12@gmail.com' });
    const reflection = new Reflection({ prompt: 'How was your day?', body: 'It was good!!!!!!!!!', user: user })
    await reflection.save();
    user.reflections.push(reflection);
    await user.save();
    console.log(user);
}

makeUser();

User.findOne({ email: 'lol12@gmail.com' })
    .populate('reflections')
    .then(user => console.log(user));
 */