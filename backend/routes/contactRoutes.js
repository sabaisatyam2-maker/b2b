const express = require("express");
const { sendContactMessage } = require("../controllers/contactController");

const router = express.Router();

// Public route for contact form
router.post("/", sendContactMessage);

module.exports = router;
