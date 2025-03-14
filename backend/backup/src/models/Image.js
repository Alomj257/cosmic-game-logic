import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
    {
        filename: {
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

imageSchema.pre('find', function () {
    if (!this.getOptions().includeDeleted) {
            this.where({ deletedAt: null });
        }
});
imageSchema.pre('findOne', function () {
    if (!this.getOptions().includeDeleted) {
            this.where({ deletedAt: null });
        }
});

const Image = mongoose.model("Image", imageSchema);
export default Image;


