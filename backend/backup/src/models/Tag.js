import mongoose from "mongoose";

const tagSchema = new mongoose.Schema(
    {
        dataTypeCode: {
            type: String,
            required: true,
            enum: [
                "GPN",
                "GPT",
                "CHN",
                "CHT",
                "SHN",
                "SHT",
                "SSHN",
                "SSHT"
            ],
        },
        openingTag: {
            type: String,
            required: true,
        },
        closingTag: {
            type: String,
            required: true,
        },
        isDefault: {
            type: Boolean,
            default: false,
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

tagSchema.pre('find', function () {
    if (!this.getOptions().includeDeleted) {
           this.where({ deletedAt: null });
       }
});
tagSchema.pre('findOne', function () {
    if (!this.getOptions().includeDeleted) {
           this.where({ deletedAt: null });
       }
});

const Tag = mongoose.model("Tag", tagSchema);
export default Tag;


