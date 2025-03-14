import mongoose from "mongoose";

const tagsSchema = new mongoose.Schema(
    {
        dataTypeCode: {
            type: String,
            required: true,
            enum: [
                "BON",  // Book No
                "BOT",  // Book Text
                "CHN",  // Chapter No
                "CHT",  // Chapter Text
                "HN",   // Heading No
                "HT",   // Heading Text
                "SHN",  // Section No
                "SHT",  // Section Text
                "SSHN", // Sub-Section No
                "SSHT" // Sub-Section Text
            ],
            index: true, // Optimized for fast queries
        },
        tagMainId: {
            type: String,
            unique: true,
            required: true,
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
    },
    {
        timestamps: true,
        toJSON: {
            transform(doc, ret) {
                delete ret.__v;
                return ret;
            },
        },
    }
);

// Auto-incrementing tagMainId within each dataTypeCode group
tagsSchema.pre("save", async function (next) {
    if (!this.isNew) return next();

    const prefix = this.dataTypeCode; // Prefix based on group type

    try {
        // Find the last tag in the same dataTypeCode group
        const lastTag = await mongoose
            .model("Tags")
            .findOne({ dataTypeCode: prefix })
            .sort({ createdAt: -1 })
            .select("tagMainId")
            .lean();

        let newIdNumber = 1.00; // Default starting ID

        if (lastTag) {
            const lastNumber = parseFloat(lastTag.tagMainId.replace(prefix, ""));
            newIdNumber = (lastNumber + 2).toFixed(2);
        }

        this.tagMainId = `${prefix}${newIdNumber}`;
        next();
    } catch (error) {
        next(error);
    }
});

const Tags = mongoose.model("Tags", tagsSchema);
export default Tags;
