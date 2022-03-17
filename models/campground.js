const mongoose = require('mongoose');
const { campgroundSchema } = require('./Schemas');
const Schema = mongoose.Schema;
const Review = require('./review')
const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200')
})
const opts = { toJSON: { virtuals: true } }
const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    description: String,
    location: String,
    image: [ImageSchema],
    review: [
        { type: Schema.Types.ObjectId, ref: 'Review' }
    ],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    geometry: {
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
}, opts);
CampgroundSchema.virtual('properties.popUpValue').get(function () {
    return `<strong><a href="/campgrounds/${this._id}">${this.title}</a></strong><p>${this.description.substring(0, 20)}...</p>`
})




CampgroundSchema.post('findOneAndDelete', async function (doc) {
    await Review.deleteMany({ _id: { $in: doc.review } })
    console.log('deleting.....')
    //when ever any crud operation is performed in this async function use await except insertMany
})
//when we find 
/*
so when we delete the parent we need to also delete children this is the best way to remove child 
arr= [id1,id2]
multiple ids present in the array
we do it with arrays 
any operator we write in the object
Campground.find({_id:{$in:arr}})
what ever ids present in the array present in the campground will be deleted
pull operator is the operator we use to remove somethinf dro the array
{$pull : {array:value}}
in this $pull only in value we use object
_id:{$in:array}
*/
module.exports = mongoose.model('Campground', CampgroundSchema);