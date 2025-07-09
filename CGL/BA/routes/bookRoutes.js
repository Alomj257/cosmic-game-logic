const express = require("express");
const router = express.Router();
const bookController = require("../controllers/bookController");

// Routes
router.post("/create", bookController.createBook);
router.get("/list", bookController.getAllBooks);
router.get("/names", bookController.getBookNamesOnly);
router.get("/:id", bookController.getBookById);
router.put("/update/:id", bookController.updateBook);
router.delete("/delete/:id", bookController.deleteBook);

module.exports = router;
