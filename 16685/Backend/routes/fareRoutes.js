const express = require("express");
const router = express.Router();
const { calculateFare } = require("../controllers/fareController");

// POST endpoint to calculate fare
router.post("/calculate", calculateFare);

module.exports = router;
