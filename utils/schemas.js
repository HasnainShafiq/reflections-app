const Joi = require('joi');

module.exports.reflectionSchema =  Joi.object({
    reflection: Joi.object({
        prompt: Joi.string().required(),
        body: Joi.string().required()
    })
})

