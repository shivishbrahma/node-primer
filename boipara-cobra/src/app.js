// Import Modules
const express = require("express");
const morgan = require("morgan");
const fileUpload = require("express-fileupload");
const path = require("path");
const methodOverride = require("method-override");
const nunjucks = require("nunjucks");

require("dotenv").config();

console.log(path.join(__dirname, "..", "public"));

// Express App
const app = express();

// Body Parser Middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Method Override Middelware
app.use(methodOverride("_method"));

// Add morgan Logger
app.use(morgan("dev"));

// File Upload Middleware
app.use(
    fileUpload({
        limits: { fileSize: 50 * 1024 * 1024 },
        useTempFiles: true,
        tempFileDir: "/tmp/",
    })
);

// Defining Nunjuck configuration
nunjucks.configure(path.resolve(__dirname, "views"), { autoscape: true, express: app });

// Static folder
app.use(express.static(path.join(__dirname, "..", "public")));

// Load Routes
const book = require("./routes/book");

// Use Routes
app.use("/book", book);

app.get("/about", function (req, res, next) {
    res.render("about.nj", { nav_active: "about" });
});

// Routes
app.get("/", function (req, res, next) {
    res.render("home.nj", { nav_active: "home" });
});

app.use(function (req, res) {
    res.status(404).render("error/404.nj");
});

const PORT = process.env.PORT || 4100;

app.listen(PORT, () => console.log(`Server started on port ${PORT}: http://localhost:${PORT}`));

module.exports = app;
