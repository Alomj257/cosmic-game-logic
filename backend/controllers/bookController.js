const Book = require("../models/Book");
const { generateBookNumbers } = require("../helpers/bookHelpers");

// Create Book
exports.createBook = async (req, res) => {
    try {
        const { auto, recordNumber, bookNumber, groupType, tagMainVersionId, tagVersionHId, tagVersionEId, bookName, briefIntroduction, authorNotes } = req.body;

        // Generate auto or manual numbers
        const { finalRecordNumber, finalBookNumber } = await generateBookNumbers(auto, recordNumber, bookNumber);

        const newBook = new Book({
            recordNumber: finalRecordNumber,
            bookNumber: finalBookNumber,
            groupType,
            tagMainVersionId,
            tagVersionHId,
            tagVersionEId,
            bookName,
            briefIntroduction,
            authorNotes
        });

        await newBook.save();
        res.status(201).json({ message: "Book created successfully", book: newBook });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get All Books
exports.getAllBooks = async (req, res) => {
    try {
        const books = await Book.find();
        res.status(200).json(books);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// ✅ New function: Get only book names
exports.getBookNamesOnly = async (req, res) => {
    try {
        const bookNames = await Book.find().select("bookName -_id");  // Select only the bookName field
        res.status(200).json(bookNames);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get Book by ID
exports.getBookById = async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json(book);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update Book
exports.updateBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }

        res.status(200).json({ message: "Book updated successfully", book });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete Book
exports.deleteBook = async (req, res) => {
    try {
        const book = await Book.findByIdAndDelete(req.params.id);
        if (!book) {
            return res.status(404).json({ message: "Book not found" });
        }
        res.status(200).json({ message: "Book deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
