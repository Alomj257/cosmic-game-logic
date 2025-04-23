const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        recordNumber: {
            type: String, // Stored as string (e.g. "1.00", "3.00")
            required: true
        },
        bookNumber: {
            type: String,
            required: true
        },
        groupType: {
            type: String,
            required: true
        },
        tagMainVersionId: {
            type: String,
            required: true
        },
        tagVersionHId: {
            type: String,
            required: true
        },
        tagVersionEId: {
            type: String,
            required: true
        },
        bookName: {
            type: String,
            required: true
        },
        briefIntroduction: [{
            paragraph: String
        }],
        authorNotes: [{
            point: String
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Book", bookSchema);
