const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagsController");

// API Routes
router.post("/create", tagController.createTag);
router.get("/list", tagController.getAllTags);
router.get("/list/:dataTypeCode", tagController.getTagsByDataType);
router.get("/:id", tagController.getTagById);
// Get tagMainIds for dataTypeCode
router.get("/tagMainIds/:dataTypeCode", tagController.getTagMainIdsByDataType);
// Get openingTag and closingTag for tagMainIds
router.get("/tagDetails/:tagMainId", tagController.getTagDetailsByTagMainId);
router.put("/update/:id", tagController.updateTag);
router.delete("/delete/:id", tagController.deleteTag);

module.exports = router;
