// Import essentials
const express = require("express");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

require("dotenv").config();
const user = require("./routes/user");

// Create an express app
const app = express();

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Declare Middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Defining Handlebars Configuration
const hbs = exphbs.create({
  handlebars: allowInsecurePrototypeAccess(handlebars),
  extname: "hbs",
  defaultLayout: "main",
  layoutsDir: path.join(__dirname, "/views", "/layouts"),
  partialsDir: path.join(__dirname, "/views", "/partials"),
});

// Static folder
app.use(express.static(path.join(__dirname, "public")));

app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");

app.use("/auth", user);

// Routes
app.get("/", function (req, res, next) {
  res.render("home");
});

const PORT = process.env.PORT || 4100;

app.listen(PORT, () =>
  console.log(`Server started on port ${PORT}\nhttp://localhost:${PORT}`),
);
