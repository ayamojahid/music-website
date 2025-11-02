
const express = require("express");
const router = express.Router();

// Temporary basic route
router.get("/", (req, res) => {
  res.json({ message: "Favorites route is working!" });
});

module.exports = router;
