const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 300; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const camp = new Campground({
            author: '621e65ba3bfd5755f8aaa369',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: Math.floor(Math.random() * 20) + 10,
            geometry: { type: 'Point', coordinates: [cities[random1000].longitude, cities[random1000].latitude] },
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Iste perspiciatis laborum dolor neque, harum tempora. Explicabo quae laboriosam a, minus blanditiis dignissimos atque porro pariatur nisi ab nihil fugit ea?',
            image: [
                {
                    url: 'https://res.cloudinary.com/dzfnqx1um/image/upload/v1647147498/YelpCamp/kgkvgjuzovufezetkpuo.jpg',
                    filename: 'YelpCamp/kgkvgjuzovufezetkpuo'
                },
                {

                    url: 'https://res.cloudinary.com/dzfnqx1um/image/upload/v1647147499/YelpCamp/awymzjuqbmo0tyw6fzjk.jpg',
                    filename: 'YelpCamp/awymzjuqbmo0tyw6fzjk'
                },
                {
                    url: 'https://res.cloudinary.com/dzfnqx1um/image/upload/v1647147499/YelpCamp/ipitocpjfwhpayujrzt7.webp',
                    filename: 'YelpCamp/ipitocpjfwhpayujrzt7'
                }
            ]

        })
        await camp.save();
    }
}
seedDB().then(() => {
    mongoose.connection.close();
})