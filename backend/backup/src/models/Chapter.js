import mongoose from "mongoose";

const chapterSchema = new mongoose.Schema(
    {
        dataTypeCode: {
            type: String,
            required: true,
            enum: [
                "CHN",
                "CHT",
            ],
        },
        groupId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Group',
            required: true,
        },
        sequenceNo: {
            type: Number,
            required: true,
        },
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chapter',
            required: false,
        },
        tagId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tag',
            required: false,
        },
        content: {
            type: String,
            required: true,
        },
        deletedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                return ret;
            },
        }
    }
);

chapterSchema.pre('find', function () {
    if (!this.getOptions().includeDeleted) {
        this.where({ deletedAt: null });
    }
});
chapterSchema.pre('findOne', function () {
    if (!this.getOptions().includeDeleted) {
        this.where({ deletedAt: null });
    }
});

const Chapter = mongoose.model("Chapter", chapterSchema);
export default Chapter;


