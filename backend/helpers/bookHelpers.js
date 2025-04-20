const Book = require("../models/Book");

exports.getNextRecordNumber = async () => {
    const lastBook = await Book.findOne().sort({ recordNumber: -1 });

    if (!lastBook) {
        return "1.00";
    }

    const lastNumber = parseFloat(lastBook.recordNumber);
    const nextNumber = (lastNumber + 2.00).toFixed(2);

    return nextNumber;
};
