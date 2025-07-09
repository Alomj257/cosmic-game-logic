const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    recordNumber: {
      type: String,
      required: true,
    },
    bookNumber: {
      type: String,
      required: true,
    },
    bookName: {
      type: String,
      required: true,
    },

    // 🔵 For the entire book
    groupType: {
      type: String,
      required: true,
    },
    tagMainVersionId: {
      type: String,
      required: true,
    },
    tagVersionHId: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 10000,
    },
    tagVersionEId: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 10000,
    },

    // 🔵 For all briefIntroduction collectively (NOT inside array)
    briefIntroGroupType: {
      type: String,
    },
    briefIntroMainVersionId: {
      type: String,
    },
    briefIntroVersionHId: {
      type: String,
      minlength: 1,
      maxlength: 10000,
    },
    briefIntroVersionEId: {
      type: String,
      minlength: 1,
      maxlength: 10000,
    },

    // 🔵 Array of paragraph texts only
    briefIntroduction: [
      {
        paragraph: {
          type: String,
        },
      },
    ],

    // 🔵 Author Notes
    authorNotes: [
      {
        point: {
          type: String,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Book", bookSchema);
