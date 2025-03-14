import createHttpError from "http-errors";
import Tag from "../../models/Tag.js";

const create = async (obj) => {
    const { dataTypeCode, openingTag, closingTag, isDefault } = obj;

    if (isDefault) {
        // check if the given dataTypeCode has already isDefault set to true then make it false
        await Tag.updateMany({ dataTypeCode, isDefault: true }, { isDefault: false });
    }

    // create a new tag and save it to the database
    const newTag = new Tag({ dataTypeCode, openingTag, closingTag, isDefault });
    await newTag.save();
    return newTag;
};

const update = async (obj) => {
    const { _id, dataTypeCode, openingTag, closingTag, isDefault } = obj;

    // check if the tag exists
    const existingTag = await Tag.findById(_id);
    if (!existingTag) {
        throw createHttpError(404, "Tag not found");
    }

    if (isDefault) {
        // check if the given dataTypeCode has already isDefault set to true then make it false expect the _id
        await Tag.updateMany({ dataTypeCode, isDefault: true, _id: { $ne: _id } }, { isDefault: false });
    }

    existingTag.dataTypeCode = dataTypeCode;
    existingTag.openingTag = openingTag;
    existingTag.closingTag = closingTag;
    existingTag.isDefault = isDefault;

    await existingTag.save();
    return existingTag;
};

const deleteTag = async (_id) => {
    console.log(_id);
    
    // check if the tag exists
    const existingTag = await Tag.findById(_id);
    if (!existingTag) {
        throw createHttpError(404, "Tag not found");
    }

    existingTag.deletedAt = new Date();
    await existingTag.save();
    return existingTag;
}

const getTagList = async () => {
    const tags = await Tag.find();
    return tags;
};

const getTagListByDataTypeCode = async (dataTypeCode) => {
    const tags = await Tag.find({ dataTypeCode });

    return tags.map(tag => ({
        _id: tag._id,
        tag: `${tag.openingTag} ${tag.closingTag}`,
        isDefault: tag.isDefault
    }));
};

const getTagById = async (tagId) => {
    const tag = await Tag.findById(tagId);
    if (!tag) {
        throw createHttpError(404, "Tag not found");
    }
    return tag;
}


export const tagServices = {
    create,
    update,
    getTagList,
    deleteTag,
    getTagListByDataTypeCode,
    getTagById
};