const express = require("express");
const router = express.Router();
const tagController = require("../controllers/tagsController");

// API Routes
router.post("/create", tagController.createTag);
router.get("/list", tagController.getAllTags);
router.get("/list/:dataTypeCode", tagController.getTagsByDataType);
router.get("/:id", tagController.getTagById);
router.put("/update/:id", tagController.updateTag);
router.delete("/delete/:id", tagController.deleteTag);

module.exports = router;
