const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const allRoutes = require('./router/allRoutes');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// لو مش محتاج sessions، تقدر تلغي الجزء ده تمامًا
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

// ❗ الربط بالرابط /api/...
app.use('/api', allRoutes);

mongoose.connect('mongodb+srv://karimkashkoush5:HwYhzwUk9eXJsQ9s@cluster0.an64b.mongodb.net/')
    .then(() => {
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Database connection error:', err);
    });
