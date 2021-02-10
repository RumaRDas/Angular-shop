const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

//import Routes
const producstRoute = require("./routes/products");
const usersRoute = require("./routes/users");

//use Route
app.use("/api/products", producstRoute);
app.use("/api/users", usersRoute);

const app = express();
app.use(
  cors({
    origin: "*",
    method: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    allowedHeaders:
      "Content-Type, Authorization, Origin, X-Requested-With, Accept",
  })
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
