const Tags = require("../models/Tags");

// ✅ Create a new tag
exports.createTag = async (req, res) => {
    try {
        const { dataTypeCode, openingTag, closingTag, isDefault } = req.body;

        if (!dataTypeCode || !openingTag || !closingTag) {
            return res.status(400).json({ message: "All fields are required" });
        }

        // If isDefault is true, update all other tags of the same type to false
        if (isDefault) {
            await Tags.updateMany({ dataTypeCode, isDefault: true }, { isDefault: false });
        }

        const newTag = new Tags({ dataTypeCode, openingTag, closingTag, isDefault });
        await newTag.save();

        res.status(201).json({ message: "Tag created successfully", tag: newTag });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Update an existing tag
exports.updateTag = async (req, res) => {
    try {
        const { _id, dataTypeCode, openingTag, closingTag, isDefault } = req.body;

        const existingTag = await Tags.findById(_id);
        if (!existingTag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        if (isDefault) {
            await Tags.updateMany({ dataTypeCode, isDefault: true, _id: { $ne: _id } }, { isDefault: false });
        }

        existingTag.dataTypeCode = dataTypeCode;
        existingTag.openingTag = openingTag;
        existingTag.closingTag = closingTag;
        existingTag.isDefault = isDefault;

        await existingTag.save();
        res.status(200).json({ message: "Tag updated successfully", tag: existingTag });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Delete a tag
exports.deleteTag = async (req, res) => {
    try {
        const { id } = req.params;
        const existingTag = await Tags.findById(id);
        if (!existingTag) {
            return res.status(404).json({ message: "Tag not found" });
        }

        await Tags.findByIdAndDelete(id);
        res.status(200).json({ message: "Tag deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get all tags
exports.getTags = async (req, res) => {
    try {
        const tags = await Tags.find();
        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get all tags by `dataTypeCode`
exports.getTagsByType = async (req, res) => {
    try {
        const { dataTypeCode } = req.params;
        const tags = await Tags.find({ dataTypeCode }).select("_id openingTag closingTag isDefault");

        res.status(200).json(tags);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};

// ✅ Get a single tag by ID
exports.getTagById = async (req, res) => {
    try {
        const { id } = req.params;
        const tag = await Tags.findById(id);
        if (!tag) {
            return res.status(404).json({ message: "Tag not found" });
        }
        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
