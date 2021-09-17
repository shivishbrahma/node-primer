// Import Modules
const express = require('express');
const morgan = require('morgan');
const exphbs = require('express-handlebars');
const helpers = require('handlebars-helpers');
const fileUpload = require('express-fileupload');
const path = require('path');
const methodOverride = require('method-override');

// Express App
const app = express();

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override Middelware
app.use(methodOverride('_method'));

// Add morgan Logger
app.use(morgan('dev'));

// File Upload Middleware
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        useTempFiles: true,
        tempFileDir: '/tmp/',
    }),
);

// Defining Handlebars Configuration
const hbs = exphbs.create({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, '/views', '/layouts'),
    partialsDir: path.join(__dirname, '/views', '/partials'),
    helpers: helpers(),
});

// Static folder
app.use(express.static(path.join(__dirname, 'public')));

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');

// Load Routes
const book = require('./routes/book');

// Use Routes
app.use('/book', book);

app.get('/about', function(req, res, next) {
    res.render('about');
});

// Routes
app.get('/', function(req, res, next) {
    res.render('home');
});



const PORT = process.env.PORT || 4100;

app.listen(PORT, () =>
    console.log(`Server started on port ${PORT}: http://localhost:${PORT}`),
);
