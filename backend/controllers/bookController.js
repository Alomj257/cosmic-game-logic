const Book = require("../models/Book");
const { getNextRecordNumber } = require("../helpers/bookHelpers");
const Chapter = require('../models/Chapter');

// Create Book
exports.createBook = async (req, res) => {
  try {
    const {
      auto,
      recordNumber,
      bookNumber,
      bookName,
      groupType,
      tagMainVersionId,
      tagVersionHId,
      tagVersionEId,
      briefIntroGroupType,
      briefIntroMainVersionId,
      briefIntroVersionHId,
      briefIntroVersionEId,
      briefIntroduction,
      authorNotes
    } = req.body;

    let finalRecordNumber;

    if (auto) {
      finalRecordNumber = await getNextRecordNumber();
    } else {
      const manualRecord = parseFloat(recordNumber);
      if (isNaN(manualRecord)) {
        return res.status(400).json({ message: "Manual record number must be a valid number." });
      }

      const existingBook = await Book.findOne({ recordNumber: manualRecord.toFixed(2) });
      if (existingBook) {
        return res.status(400).json({ message: "This record number already exists. Please choose another." });
      }

      finalRecordNumber = manualRecord.toFixed(2);
    }

    const newBook = new Book({
      recordNumber: finalRecordNumber,
      bookNumber,
      bookName,
      groupType,
      tagMainVersionId,
      tagVersionHId,
      tagVersionEId,
      briefIntroGroupType,
      briefIntroMainVersionId,
      briefIntroVersionHId,
      briefIntroVersionEId,
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

// Get only Book Names
exports.getBookNamesOnly = async (req, res) => {
  try {
    const bookNames = await Book.find().select("bookName -_id");
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

exports.getBooksWithChapters = async (req, res) => {
  try {
    // Fetch all books
    const books = await Book.find({}).lean();

    // Fetch all chapters grouped by bookId
    const chapters = await Chapter.find({}).lean();

    // Create a map: bookId => [chapters]
    const chaptersMap = chapters.reduce((acc, chapter) => {
      if (!acc[chapter.bookId]) acc[chapter.bookId] = [];
      acc[chapter.bookId].push(chapter);
      return acc;
    }, {});

    // Attach chapters array to each book
    const booksWithChapters = books.map((book) => ({
      ...book,
      chapters: chaptersMap[book._id] || [],
    }));

    res.status(200).json(booksWithChapters);
  } catch (error) {
    console.error('Error fetching books with chapters:', error);
    res.status(500).json({ message: 'Server error' });
  }
};