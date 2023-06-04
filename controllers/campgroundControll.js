const campground = require("../models/campground");
const Campground = require("../models/campground");
const cloudinary = require("cloudinary");
const mapbox = require("@mapbox/mapbox-sdk/services/geocoding");
const mpbBox = require("@mapbox/mapbox-sdk/services/geocoding");
const mpbToken = process.env.token;
const geoCoding = mpbBox({ accessToken: mpbToken });
//getting access to the account
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render("campgrounds/index", { campgrounds });
};
module.exports.newCampground = (req, res) => {
  // console.log(req.originalUrl)
  res.render("campgrounds/new");
};
module.exports.createCampground = async (req, res) => {
  //what ever we give the type it automatically gets the full object of ti
  console.log(req.body);

  const loc = await geoCoding
    .forwardGeocode({
      query: req.body.campground.location,
      limit: 1,
    })
    .send();
  // res.send(loc.body.features[0].geometry.coordinates)

  const campground = new Campground(req.body.campground);
  campground.geometry = loc.body.features[0].geometry;
  campground.image = req.files.map((f) => ({
    url: f.path,
    filename: f.filename,
  }));
  console.log(campground);
  campground.author = req.user._id;
  req.flash("success", "success creating campground!!");

  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
};
module.exports.showCampground = async (req, res) => {
  const campground = await Campground.findById(req.params.id)
    .populate({
      path: "review",
      populate: {
        path: "author",
      },
    })
    .populate("author");
  //n ested populating where reviw schema contains objectId of the given user
  if (!campground) {
    req.flash("error", "cannot find campground!!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/show", { campground });
};
module.exports.showEditForm = async (req, res) => {
  const campground = await Campground.findById(req.params.id);
  if (!campground) {
    req.flash("error", "cannot find campground!!");
    return res.redirect("/campgrounds");
  }
  res.render("campgrounds/edit", { campground });
};
module.exports.updateForm = async (req, res) => {
  console.log(req.body);
  if (!req.body.campground) {
    throw new ErrorHandler("Invalid data", 404);
  }
  image = req.files.map((f) => ({ url: f.path, filename: f.filename }));
  const camp = await Campground.findByIdAndUpdate(req.params.id, {
    ...req.body.campground,
  });
  camp.image.push(...image);
  await camp.save();
  if (req.body.deleteImages) {
    for (let filename of req.body.deleteImages) {
      await cloudinary.uploader.destroy(filename);
      //delete from cloudinary
    }
    await camp.updateOne({
      $pull: { image: { filename: { $in: req.body.deleteImages } } },
    });
    //delete from database
  }
  console.log(req.body);
  req.flash("success", "Successfully updated campground!!!!!!");
  res.redirect(`/campgrounds/${camp._id}`);
};
module.exports.delete = async (req, res) => {
  const { id } = req.params;
  console.log(req.body);
  await Campground.findByIdAndDelete(id);
  req.flash("success", "Successfully deleated campground!!");
  res.redirect("/campgrounds");
};
