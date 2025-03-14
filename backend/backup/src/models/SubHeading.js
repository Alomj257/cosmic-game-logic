import mongoose from "mongoose";

const subHeadingSchema = new mongoose.Schema(
    {
        dataTypeCode: {
            type: String,
            required: true,
            enum: [
                "SHN",
                "SHT",
            ],
        },
        chapterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Chapter',
            required: true,
        },
        sequenceNo: {
            type: Number,
            required: true,
        },
        subHeadingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubHeading',
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

subHeadingSchema.pre('find', function () {
    if (!this.getOptions().includeDeleted) {
           this.where({ deletedAt: null });
       }
});
subHeadingSchema.pre('findOne', function () {
    if (!this.getOptions().includeDeleted) {
           this.where({ deletedAt: null });
       }
});

const SubHeading = mongoose.model("SubHeading", subHeadingSchema);
export default SubHeading;


