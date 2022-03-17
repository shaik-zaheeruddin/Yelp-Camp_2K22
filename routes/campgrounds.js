const express = require('express')
const Router = express.Router()
const catchErr = require('../utils/catchError')
const campgrounds = require('../controllers/campgroundControll')
const { storage, cloudinary } = require('../cloudinary/index')
const { isLoggedIn, validate, author, reviewAuthor } = require('../authenticationCheck')
const multer = require('multer')
const upload = multer({ storage })
//to convert the image in the text we use the multer
//so that user can select a file from the device and that is converted in to text format
//upload is the desitnation where the texted image files should be
Router.route('/')
    .get(catchErr(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validate, catchErr(campgrounds.createCampground))

Router.get('/new', isLoggedIn, campgrounds.newCampground)

Router.route('/:id')
    .get(catchErr(campgrounds.showCampground))
    .put(isLoggedIn, upload.array('image'), validate, author, catchErr(campgrounds.updateForm))
    .delete(isLoggedIn, reviewAuthor, catchErr(campgrounds.delete))

Router.get('/:id/edit', isLoggedIn, author, catchErr(campgrounds.showEditForm))

module.exports = Router
//when we take campground and update we need to use camp.save()
//other wise direct fidnByIdAndUpdate is enough
//then we store the texted files in cloudinary it parses them and uses as the image and store on their account