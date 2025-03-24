const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        recordNumber: {
            type: String,     // Auto or Manual numbering
            required: true
        },
        bookNumber: {
            type: String,     // Auto or Manual numbering
            required: true
        },
        groupType: {          // dataTypesCode
            type: String,
            required: true
        },
        tagMainVersionId: {   // tagMainId
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
        briefIntroduction: {
            type: String
        },
        authorNotes: [{
            point: String
        }]
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Book", bookSchema);
