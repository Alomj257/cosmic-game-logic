const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        recordNumber: {
            type: String,    // Auto or Manual numbering
            required: true
        },
        bookNumber: {
            type: String,    // Same as record number
            required: true
        },
        groupType: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tags",
            required: true
        },
        tagMainId: {
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
        name: {
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
