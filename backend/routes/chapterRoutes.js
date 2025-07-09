const express = require("express");
const router = express.Router();
const chapterController = require("../controllers/chapterController");

// Create Chapter
router.post("/", chapterController.createChapter);

// Get All Chapters (optionally by bookId)
router.get("/", chapterController.getChapters);

// Get Single Chapter by ID
router.get("/:id", chapterController.getChapterById);

// Update Chapter
router.put("/:id", chapterController.updateChapter);

// Delete Chapter
router.delete("/:id", chapterController.deleteChapter);

module.exports = router;
