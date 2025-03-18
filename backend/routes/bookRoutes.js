const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Routes
router.post("/create", bookController.createBook);
router.get("/list", bookController.getAllBooks);
router.get("/:id", bookController.getBookById);
router.put("/update/:id", bookController.updateBook);
router.delete("/delete/:id", bookController.deleteBook);

// Route to fetch tags based on group type
router.get("/tags/:groupType", bookController.getTagsByGroupType);

module.exports = router;
