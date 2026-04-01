const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const session = require("express-session");
const fileUpload = require("express-fileupload");

const { notFound, errorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const homeRoutes = require("./routes/homeRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const settingsRoutes = require("./routes/settingsRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// View engine
app.set("views", path.join(__dirname, "..", "views"));
app.set("view engine", "ejs");

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "dev-secret",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(fileUpload());
app.use(express.static(path.join(__dirname, "..", "public")));

// Routes
app.use(homeRoutes);
app.use(authRoutes);
app.use(cartRoutes);
app.use(orderRoutes);
app.use(settingsRoutes);
app.use(adminRoutes);

// Error handling
app.use(notFound);
app.use(errorHandler);

module.exports = app;
