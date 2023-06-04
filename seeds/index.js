const mongoose = require("mongoose");
const cities = require("./cities");
const { places, descriptors } = require("./seedHelpers");
const Campground = require("../models/campground");
//while seeding do this
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
//so mongoose connections string must be in env
const dbUrl = process.env.db_url || "mongodb://localhost:27017/yelp-camp";
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const sample = (array) => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
  await Campground.deleteMany({});
  //10 done
  for (let i = 0; i < 10; i++) {
    const random1000 = Math.floor(Math.random() * 1000);
    const url = [
      {
        url: "https://res.cloudinary.com/dzfnqx1um/image/upload/v1685883371/YelpCamp/scott-goodwill-y8Ngwq34_Ak-unsplash_cb5xbl.jpg",
        filename: "YelpCamp/scott-goodwill-y8Ngwq34_Ak-unsplash_cb5xbl",
      },
      {
        url: "https://res.cloudinary.com/dzfnqx1um/image/upload/v1685883962/YelpCamp/w1_imxoea.avif",
        filename: "YelpCamp/w1_imxoea.",
      },
      {
        url: "https://res.cloudinary.com/dzfnqx1um/image/upload/v1685883960/YelpCamp/w2_vg9wrp.avif",
        filename: "YelpCamp/w2_vg9wrp",
      },
      {
        url: "https://res.cloudinary.com/dzfnqx1um/image/upload/v1685883960/YelpCamp/w3_ojqdzr.avif",
        filename: "YelpCamp/w3_ojqdzr",
      },
      {
        url: "https://res.cloudinary.com/dzfnqx1um/image/upload/v1685883962/YelpCamp/w4_x4zem9.avif",
        filename: "YelpCamp/w4_x4zem9",
      },
      {
        url: "https://res.cloudinary.com/dzfnqx1um/image/upload/v1685883962/YelpCamp/w5_xyiqdv.avif",
        filename: "YelpCamp/w5_xyiqdv",
      },
      {
        url: "https://res.cloudinary.com/dzfnqx1um/image/upload/v1685883960/YelpCamp/w6_vecgma.avif",
        filename: "YelpCamp/w6_vecgma",
      },
    ];

    //   "https://res.cloudinary.com/dzfnqx1um/image/upload/v1647147498/YelpCamp/kgkvgjuzovufezetkpuo.jpg"
    //   "https://res.cloudinary.com/dzfnqx1um/image/upload/v1647147499/YelpCamp/awymzjuqbmo0tyw6fzjk.jpg"
    const numb1 = Math.floor(Math.random() * url.length);
    const obj = url[numb1];
    url.splice(numb1, 1);

    const numb2 = Math.floor(Math.random() * url.length);
    const obj1 = url[numb2];
    url.splice(numb2, 1);

    const numb3 = Math.floor(Math.random() * url.length);
    const obj3 = url[numb3];
    console.log(obj, obj1, obj3);
    // console.log(numb1, url[numb1]);
    const camp = new Campground({
      author: "647c7fda9e66158200a2c392",
      location: `${cities[random1000].city}, ${cities[random1000].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      price: Math.floor(Math.random() * 20) + 10,
      geometry: {
        type: "Point",
        coordinates: [
          cities[random1000].longitude,
          cities[random1000].latitude,
        ],
      },
      description:
        "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste perspiciatis laborum dolor neque, harum tempora. Explicabo quae laboriosam a, minus blanditiis dignissimos atque porro pariatur nisi ab nihil fugit ea?",
      image: [obj, obj1, obj3],
    });
    await camp.save();
  }
};
seedDB().then(() => {
  mongoose.connection.close();
});
