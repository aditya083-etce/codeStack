const express = require("express");
const router = express.Router();
const { getAllProblemsToRelatedTag, getAllProblems } = require("../controllers/problemController");

router.post("/getAllProblems", getAllProblems);

module.exports = router;
