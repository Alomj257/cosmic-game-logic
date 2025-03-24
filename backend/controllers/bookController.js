const Book = require("../models/Book");

// Auto Increment Logic
const getNextRecordNumber = async () => {
    const lastBook = await Book.findOne().sort({ createdAt: -1 });
    if (lastBook) {
        const lastNumber = parseFloat(lastBook.recordNumber);
        return (lastNumber + 2).toFixed(2);  // Increment by 2.00
    }
    return "1.00";
};

// Create Book
exports.createBook = async (req, res) => {
    try {
        const { auto, recordNumber, bookNumber, groupType, tagMainVersionId, tagVersionHId, tagVersionEId, bookName, briefIntroduction, authorNotes } = req.body;

        // Auto-increment logic
        let newRecordNumber = recordNumber;
        if (auto) {
            newRecordNumber = await getNextRecordNumber();
        }

        const newBook = new Book({
            recordNumber: newRecordNumber,
            bookNumber: newRecordNumber,
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
        const updatedData = { ...req.body };

        const book = await Book.findByIdAndUpdate(req.params.id, updatedData, { new: true });

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
