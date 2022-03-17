const express = require('express');
const router = express.Router({ mergeParams: true });
// const ExpressError = require('../utils/Error');
const catchAsync = require('../utils/catchError');
const { validateReview, isLoggedIn, reviewAuthor } = require('../authenticationCheck')
const reviews = require('../controllers/reviewControllers')

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview))

router.delete('/:reviewId', isLoggedIn, reviewAuthor, catchAsync(reviews.delete))

module.exports = router;