const express = require("express");
const morgan = require("morgan");
const dotenv = require("dotenv");
require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const rvsp = require("./routes/rvsp");

// const apiMiddleware = require("./middleware/apiAuth");

dotenv.config({ path: ".env" }); // Load .env file

const app = express();

// Set the view engine to EJS
app.set("view engine", "ejs");
console.log(path.join(__dirname, "views"));

// Set the directory where views are located
app.set("views", path.join(__dirname, "views"));

app.use(bodyParser.urlencoded({ extended: true }));

const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
];
app.use(morgan("dev"));

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

app.use(bodyParser.json());

// Route definitions
app.use("/rvsp", rvsp);

// Not Found error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// Error handlers
app.use((err, req, res, next) => {
  // Log the error
  console.error(err.stack);

  // Set the error status code
  const statusCode = err.status || 500;

  // Respond with the error message
  res.status(statusCode);
  res.render("error", {
    message: err.message,
    error: app.get("env") === "development" ? err : {},
    statusCode, // Pass the statusCode to the view
    app, // Pass the app instance to the view
  });
});

// Catch-all route handler
app.use("*", (req, res) => {
  console.log(`Requested route: ${req.originalUrl}`);
  res.status(404).send("Not Found");
});

const port = process.env.PORT || 4022;
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
