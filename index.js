
require('dotenv').config()
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate')
const ErrorHandler = require('./utils/Error')
const flash = require('connect-flash')
const session = require('express-session');
const passport = require('passport')
const passportLocal = require('passport-local')
const User = require('./models/user')
const helmet = require('helmet')
const dbUrl = process.env.db_url || 'mongodb://localhost:27017/yelp-camp'
// const cloud = require('')
const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dzfnqx1um/"
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net/",
    "https://res.cloudinary.com/dzfnqx1um/"
];
const connectSrcUrls = [
    "https://*.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://events.mapbox.com",
    "https://res.cloudinary.com/dzfnqx1um/"
];
const fontSrcUrls = ["https://res.cloudinary.com/dzfnqx1um/"];
////////////////////////////////////////////////////////
const campRoute = require('./routes/campgrounds')
const reviewRoute = require('./routes/reviews')
const userRoute = require('./routes/users')
//////////////////////////////////////////////////////
const MongoDbStore = require('connect-mongo')
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
const secret = process.env.SECRET || 'goodsecret';
const config = {

    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    },
    store: MongoDbStore.create({
        mongoUrl: dbUrl,
        touchAfter: 24 * 3600
        // time period in seconds
    }),
}
// const dbUrl = process.env.db_url
// 'mongodb://localhost:27017/yelp-camp'

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("DB connected yes!!!");
});
const app = express();


const mongoSanitize = require('express-mongo-sanitize')
app.engine('ejs', ejsMate)

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.use(session(config))
app.use(flash())
app.use(mongoSanitize({
    replaceWith: '_'
}))
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dzfnqx1um/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                "https://images.unsplash.com/"
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
            mediaSrc: ["https://res.cloudinary.com/dzfnqx1um/"],
            childSrc: ["blob:"]
        }
    })
);
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(passport.initialize())
app.use(passport.session())
passport.use(new passportLocal(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())
app.use((req, res, next) => {
    res.locals.user = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

app.use('/campgrounds', campRoute);
app.use('/campgrounds/:id/review', reviewRoute);
app.get('/', (req, res) => {
    res.render('home')
});

app.use('/', userRoute)

app.all('*', function (req, res, next) {
    next(new ErrorHandler('Page not found ', 400))
})
app.use((err, req, res, next) => {
    const { status = 500 } = err
    if (!err.message) {
        err.message = 'some thing went wrong'
    }
    res.status(status).render('Error.ejs', { err })
})
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log('Serving on port ' + port)
})