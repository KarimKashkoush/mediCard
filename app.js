const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const app = express();
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const User = require('./models/User');
const Register = require('./models/register');
const userController = require('./controllers/userController');
const allRoutes = require('./router/allRoutes');

app.use(session({
    secret: 'aVery$trongS3cretKey@2024',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: 'mongodb+srv://karimkashkoush5:HwYhzwUk9eXJsQ9s@cluster0.an64b.mongodb.net/',
        collectionName: 'sessions',
    }),
    cookie: {
        secure: false,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}));

app.use(methodOverride('_method'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.static('uploads/images'));
app.use(express.urlencoded({ extended: true }));

app.use(allRoutes);



mongoose.connect("mongodb+srv://karimkashkoush5:HwYhzwUk9eXJsQ9s@cluster0.an64b.mongodb.net/")
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
