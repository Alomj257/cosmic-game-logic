const Chapter = require("../models/Chapter");
const Book = require("../models/Book");

// 🔢 Generate next chapter number: CHNo 1.00, CHNo 2.00, ...
const generateChapterNumber = async (bookId) => {
  const count = await Chapter.countDocuments({ bookId });
  const number = (count + 1).toFixed(2); // 1.00, 2.00, etc.
  return `CHNo ${number}`;
};

// 📌 Create a new chapter (auto fetch recordNumber and bookNumber from Book)
exports.createChapter = async (req, res) => {
  try {
    const { bookId, chapterName, chapterTag, contentTag, content } = req.body;

    // Fetch book info
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        success: false,
        message: "Book not found with the given bookId",
      });
    }

    // Generate chapter number
    const chapterNumber = await generateChapterNumber(bookId);

    // Create chapter document
    const newChapter = new Chapter({
      bookId,
      recordNumber: book.recordNumber, // pulled from Book
      bookNumber: book.bookNumber,     // pulled from Book
      chapterNumber,
      chapterName,
      chapterTag,
      contentTag,
      content,
    });

    await newChapter.save();

    res.status(201).json({
      success: true,
      message: "Chapter created successfully",
      chapter: newChapter,
    });
  } catch (error) {
    console.error("Create Chapter Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while creating chapter",
    });
  }
};

// 📥 Get all chapters (optionally filter by bookId)
exports.getChapters = async (req, res) => {
  try {
    const { bookId } = req.query;
    const filter = bookId ? { bookId } : {};

    const chapters = await Chapter.find(filter).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      chapters,
    });
  } catch (error) {
    console.error("Get Chapters Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching chapters",
    });
  }
};

// 📘 Get single chapter by ID
exports.getChapterById = async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);

    if (!chapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    res.status(200).json({
      success: true,
      chapter,
    });
  } catch (error) {
    console.error("Get Chapter By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching chapter",
    });
  }
};

// ✏️ Update a chapter by ID
exports.updateChapter = async (req, res) => {
  try {
    const updatedChapter = await Chapter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedChapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chapter updated successfully",
      chapter: updatedChapter,
    });
  } catch (error) {
    console.error("Update Chapter Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating chapter",
    });
  }
};

// ❌ Delete a chapter by ID
exports.deleteChapter = async (req, res) => {
  try {
    const deletedChapter = await Chapter.findByIdAndDelete(req.params.id);

    if (!deletedChapter) {
      return res.status(404).json({
        success: false,
        message: "Chapter not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Chapter deleted successfully",
    });
  } catch (error) {
    console.error("Delete Chapter Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while deleting chapter",
    });
  }
};

// 🔢 Get chapter count for a specific book
exports.getChapterCountByBookId = async (req, res) => {
  try {
    const { bookId } = req.params;

    const count = await Chapter.countDocuments({ bookId });

    res.status(200).json({
      success: true,
      count,
    });
  } catch (error) {
    console.error("Get Chapter Count Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching chapter count",
    });
  }
};
