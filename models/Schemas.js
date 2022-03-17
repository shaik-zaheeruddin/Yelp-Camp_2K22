// const joi = require('joi')
// module.exports.campgroundSchema = joi.object({
//     campground: joi.object({
//         title: joi.string().required(),
//         price: joi.number().min(0).required(),
//         location: joi.string().min(3).required(),
//         // image: joi.string().required(),
//         description: joi.string().required()
//     }).required(),
//     deleteImages: joi.array()
// })
// module.exports.reviewSchema = joi.object({
//     review: joi.object({
//         rating: joi.number().required().min(1),
//         body: joi.string().required()
//     }).required()
// })
//we dont required the review object
/*
we can send any thing
{
    title:'djks'
}
schema
{
review:{
    title:'d js'
}
}
validate method looks for the errors if the requirement is not meant 
then there will be an error

*/
//colt review
const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.campgroundSchema = Joi.object({
    campground: Joi.object({
        title: Joi.string().required().escapeHTML(),
        price: Joi.number().required().min(0),
        location: Joi.string().required().escapeHTML(),
        description: Joi.string().required().escapeHTML()
    }).required(),
    deleteImages: Joi.array()
});
//first we need to copy whole thing 
/*
and we need to to extend that joi wiht the extension
and for every input we can add 
.escapeHTML()
*/
module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})