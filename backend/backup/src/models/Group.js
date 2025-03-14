import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
    {
        dataTypeCode: {
            type: String,
            required: true,
            enum: [
                "GPN",
                "GPT",
            ],
        },
        sequenceNo: {
            type: Number,
            required: true,
        },
        groupId:{
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Group', 
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

groupSchema.pre('find', function () {
    if (!this.getOptions().includeDeleted) {
        this.where({ deletedAt: null });
    }
});
groupSchema.pre('findOne', function () {
    if (!this.getOptions().includeDeleted) {
        this.where({ deletedAt: null });
    }
});

const Group = mongoose.model("Group", groupSchema);
export default Group;


