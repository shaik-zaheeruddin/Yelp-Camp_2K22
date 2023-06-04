const Campground = require("./models/campground");
const Review = require("./models/review");
const { campgroundSchema } = require("./models/Schemas");
const ErrorHandler = require("./utils/Error");
const { reviewSchema } = require("./models/Schemas");
const ExpressError = require("./utils/Error");
module.exports.isLoggedIn = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.lastUrl = req.originalUrl;
    // console.log(req.path, req.originalUrl)
    req.flash("error", "you need to first log in");
    return res.redirect("/login");
  }
  next();
};
module.exports.validate = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  console.log(error);
  if (error) {
    const msg = error.details.map((e) => e.message).join(",");
    throw new ErrorHandler(msg, 400);
  } else {
    next();
  }
};
module.exports.author = async (req, res, next) => {
  const { id } = req.params;
  const camp = await Campground.findById(id);
  if (!camp.author.equals(req.user._id)) {
    req.flash("error", "you dont have permission");
    return res.redirect("/campgrounds/" + id);
  }
  next();
};
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};
module.exports.reviewAuthor = async (req, res, next) => {
  const { reviewId, id } = req.params;
  const review = await Review.findById(reviewId);
  if (review && !review.author.equals(req.user._id)) {
    req.flash("error", "you dont have permission");
    return res.redirect("/campgrounds/" + id);
  }
  next();
};
