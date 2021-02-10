const express = require("express");
const router = express.Router();
const { database } = require("../config/helper");

/* GET ALL PRODUCTS */
router.get("/", function (req, res) {
  let page =
    req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1; // set the current page number
  const limit =
    req.query.limit !== undefined && req.query.limit !== 0
      ? req.query.limit
      : 10; //Set the limit item per page

  let startValue;
  let endValue;

  if (page > 0) {
    startValue = page * limit - limit; //0,10,20,30
    endValue = page * limit; //10,20,30,40
  } else {
    startValue = 0;
    endValue = 10;
  }
});

module.exports = router;
