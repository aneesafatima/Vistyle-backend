const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const http = require("http");
// const bodyParser = require("body-parser");
// const errorController = require("./controllers/errorController");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const hpp = require("hpp");
const cors = require("cors");
const ErrorController = require("./controllers/ErrorController");
dotenv.config({ path: "./.env" });
const DB = process.env.DB_CONNECTION_STRING.replace(
  "<password>",
  process.env.DB_PASSWORD
);
const app = express(); //app is an instance of express
app.use(cors());
app.use(express.json());

//ERROR HANDLING
// This will catch any uncaught exceptions from anywhere in your app
process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! 💥 Shutting down...");
  console.error(err.name, err.message);
  process.exit(1);
});
// This will catch any unhandled promise rejections from anywhere in your app
process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.error(err);
  // Attempt to close server gracefully before exiting
  server.close(() => {
    process.exit(1);
  });
});

// Middleware setup
// Set Security HTTP Headers using Helmet
// app.use(
//   helmet({
//     crossOriginResourcePolicy: { policy: "cross-origin" }, // CORP (Cross-Origin Resource Policy):
//     // Allows cross-origin access for images, videos, etc.
//   })
// );

// Data Sanitization against NoSQL Injection attacks
app.use(mongoSanitize());

// Prevent HTTP Parameter Pollution
app.use(hpp());

// app.use(express.urlencoded({ extended: true }));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/products", productRouter);
app.get("/", (req, res) => {
  res.status(200).json({
    message: "hello world",
  });
});

app.use("*", (req, res) => {
  res.status(404).json({
    message: "Not Found",
  });
});

app.use(ErrorController); //LEFT TO BE CREATED

mongoose
  .connect(DB, {})
  .then(() => {
    console.log("Mongodb connected");

    if (process.env.NODE_ENV === "development") {
      const server = http.createServer(app);
      server.listen(process.env.PORT, () => {
        console.log(`Server is listening on port ${process.env.PORT}`);
      });
    }
  })
  .catch((err) => {
    console.error("DATABASE CONNECTION ERROR:", err);
    process.exit(1); //appication halting with an error
  });

module.exports = app;
