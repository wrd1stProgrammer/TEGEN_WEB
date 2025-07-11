const express = require("express");
const {
  analyzeReceipt,
  analyzeFace
} = require("../controllers/gemini/analyzeFace");

const router = express.Router();

router.post("/analyzeface", analyzeFace);



module.exports = router;