import Joi from "joi";

export const createChapterSchema = Joi.object({
    dataTypeCode: Joi.string().required().valid("CHN", "CHT"),
    sequenceNo: Joi.number().required(),
    groupId: Joi.string().required(),
    chapterId: Joi.string().required().allow(null),
    content: Joi.string().required(),
    tagId: Joi.string().required().allow(null),
}).custom((value, helpers) => {
    if (value.dataTypeCode === "CHT" && value.chapterId == null) {
        return helpers.message({ custom: '"chapterId is required incase dataTypeCode is CHT' });
    }
    if (value.dataTypeCode === "CHN" && value.chapterId != null) {
        return helpers.message({ custom: '"chapterId should be null incase dataTypeCode is CHN' });
    }
    return value;
});

export const updateChapterSchema = Joi.object({
    _id: Joi.string().required(),
    dataTypeCode: Joi.string().required().valid("CHN", "CHT"),
    sequenceNo: Joi.number().required(),
    groupId: Joi.string().required(),
    chapterId: Joi.string().required().allow(null),
    content: Joi.string().required(),
    tagId: Joi.string().required().allow(null),
}).custom((value, helpers) => {
    if (value.dataTypeCode === "CHT" && value.chapterId == null) {
        return helpers.message({ custom: '"chapterId is required incase dataTypeCode is CHT' });
    }
    if (value.dataTypeCode === "CHN" && value.chapterId != null) {
        return helpers.message({ custom: '"chapterId should be null incase dataTypeCode is CHN' });
    }
    return value;
});


export const getChapterSchema = Joi.object({
    groupId: Joi.string().required()
});