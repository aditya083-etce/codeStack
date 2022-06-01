const express = require("express");
const router = express.Router();
const { addUserDefinedTag, getAllTags, getUserDefinedTags, searchTags } = require("../controllers/tagController");

// router.get("/allTags/:offset", getAllTags);
router.get("/allTags", getAllTags);

router.post("/addUserDefinedTag/:problemId", addUserDefinedTag);

router.get("/userDefinedTags/:problemId", getUserDefinedTags);

router.get("/searchTag", searchTags);

module.exports = router;
