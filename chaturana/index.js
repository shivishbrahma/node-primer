const express = require("express");
const exphbs = require("express-handlebars");
const handlebars = require("handlebars");
const cookieParser = require("cookie-parser");
const {
	allowInsecurePrototypeAccess,
} = require("@handlebars/allow-prototype-access");

const morgan = require("morgan");
const helmet = require("helmet");
const cors = require("cors");
const path = require("path");
const http = require("http");
const socketIO = require("socket.io");

require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

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

// Routes
app.get("/", function (req, res, next) {
	res.render("home");
});

const PORT = process.env.PORT;

server.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
