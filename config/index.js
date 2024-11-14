// We reuse this import in order to have access to the `body` property in requests
const express = require("express");

// ℹ️ Responsible for the messages you see in the terminal as requests are coming in
// https://www.npmjs.com/package/morgan
const logger = require("morgan");

// ℹ️ Needed when we deal with cookies (we will when dealing with authentication)
// https://www.npmjs.com/package/cookie-parser
const cookieParser = require("cookie-parser");

// ℹ️ Needed to accept from requests from 'the outside'. CORS stands for cross origin resource sharing
// unless the request if from the same domain, by default express wont accept POST requests
const cors = require("cors");

const FRONTEND_URL = process.env.ORIGIN || "http://localhost:5173";

// Middleware configuration
module.exports = (app) => {
  // Because this is a server that will accept requests from outside and it will be hosted ona server with a `proxy`, express needs to know that it should trust that setting.
  // Services like heroku use something called a proxy and you need to add this to your server
  app.set("trust proxy", 1);

  app.use(
    cors({
      origin: ["http://localhost:5173", process.env.ORIGIN],
      credentials: true, // Add this if you need to allow cookies or auth headers
    })
  );
  // app.use((req, res, next) => {
  //   res.header(
  //     "Access-Control-Allow-Origin",
  //     process.env.ORIGIN || "http://localhost:5173"
  //   ); // Use env variable or fallback to localhost
  //   res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  //   res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  //   // Handle preflight requests
  //   if (req.method === "OPTIONS") {
  //     res.sendStatus(200);
  //   } else {
  //     next();
  //   }
  // });

  // In development environment the app logs
  app.use(logger("dev"));

  // To have access to `body` property in the request
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(cookieParser());
};
