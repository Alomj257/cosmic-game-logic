const Book = require("../models/Book");

// Helper function to get the next auto-incremented number
const getNextAutoNumber = async () => {
    const lastBook = await Book.findOne().sort({ createdAt: -1 });

    if (lastBook) {
        const lastNumber = parseFloat(lastBook.recordNumber);
        return (lastNumber + 2).toFixed(2);  // Increment by 2.00
    }
    return "1.00";  // First auto number
};

// Helper function to generate record and book numbers
const generateBookNumbers = async (auto, recordNumber, bookNumber) => {
    let finalRecordNumber = recordNumber;
    let finalBookNumber = bookNumber;

    if (auto) {
        const nextNumber = await getNextAutoNumber();
        finalRecordNumber = recordNumber || nextNumber;
        finalBookNumber = bookNumber || nextNumber;
    }

    return { finalRecordNumber, finalBookNumber };
};

module.exports = {
    getNextAutoNumber,
    generateBookNumbers
};
