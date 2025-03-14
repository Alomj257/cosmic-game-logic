import mongoose from "mongoose";

const subSubHeadingSchema = new mongoose.Schema(
    {
        dataTypeCode: {
            type: String,
            required: true,
            enum: [
                "SSHN",
                "SSHT",
            ],
        },
        subHeadingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubHeading',
            required: true,
        },
        sequenceNo: {
            type: Number,
            required: true,
        },
        subSubHeadingId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubSubHeading',
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

subSubHeadingSchema.pre('find', function () {
    if (!this.getOptions().includeDeleted) {
           this.where({ deletedAt: null });
       }
});
subSubHeadingSchema.pre('findOne', function () {
    if (!this.getOptions().includeDeleted) {
           this.where({ deletedAt: null });
       }
});

const SubSubHeading = mongoose.model("SubSubHeading", subSubHeadingSchema);
export default SubSubHeading;


