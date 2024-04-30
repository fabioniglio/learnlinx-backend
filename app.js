const express = require("express");
// const morgan = require("morgan");
// const cors = require("cors");
// const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const PORT = 5005;
const Event = require("./models/Event.model");
const Course = require("./models/Course.model");
const User = require("./models/User.model");
// const { isAuthenticated } = require("./middleware/jwt.middleware"); // <== IMPORT

// ℹ️ Gets access to environment variables/settings
// https://www.npmjs.com/package/dotenv
require("dotenv").config();

// Handles http requests (express is node js framework)
// https://www.npmjs.com/package/express
// const express = require('express')

const app = express();
// ℹ️ This function is getting exported from the config folder. It runs most pieces of middleware
require("./config")(app);

// mongoose
//   .connect("mongodb://127.0.0.1:27017/learnlinx-api")
//   .then((x) => console.log(`Connected to Database: "${x.connections[0].name}"`))
//   .catch((err) => console.error("Error connecting to MongoDB", err));

// 👇 Start handling routes here
const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

const authRoutes = require("./routes/auth.routes");
app.use("/auth", authRoutes);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
