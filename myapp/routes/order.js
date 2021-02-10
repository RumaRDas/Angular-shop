const express = require("express");
const router = express.Router();
const { database } = require("../config/helper");

/* GET ALL RDERS*/
router.get("/", function (req, res) {
  database
    .table("orders_details as od")
    .join([
      {
        table: "orders as o",
        on: "o.id = od.order_id",
      },
      {
        table: "products as p",
        on: "p.id = od.product_id",
      },
      {
        table: "users as u",
        on: "u.id = o.user_id",
      },
    ])
    .withFields(["o.id", "p.title", "p.description", "p.price", "u.username"])
    .getAll()
    .then((orders) => {
      if (orders.length > 0) {
        res.json(orders);
      } else {
        res.json({ message: "No order found" });
      }
    })
    .catch((err) => res.json(err));
});

module.exports = router;
