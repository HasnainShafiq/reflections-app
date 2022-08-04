const Reflection = require('../models/reflection');

module.exports.isUser = async (req, res, next) => {
    const { id } = req.params;
    const reflection = await Reflection.findById(id);
    if (!reflection.user.equals(req.user._id)) {
        req.flash('error', 'you do not have permission for that')
        return res.redirect('/reflections');
    }
    next()
}