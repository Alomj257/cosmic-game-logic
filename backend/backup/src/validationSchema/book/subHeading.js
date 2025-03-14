import Joi from "joi";

export const createSubHeadingSchema = Joi.object({
    dataTypeCode: Joi.string().required().valid("SHN", "SHT"),
    sequenceNo: Joi.number().required(),
    chapterId: Joi.string().required(),
    subHeadingId: Joi.string().required().allow(null),
    content: Joi.string().required(),
    tagId: Joi.string().required().allow(null),
}).custom((value, helpers) => {
    if (value.dataTypeCode === "SHT" && value.subHeadingId == null) {
        return helpers.message({ custom: '"subHeadingId is required incase dataTypeCode is SHT' });
    }
    if (value.dataTypeCode === "SHN" && value.subHeadingId != null) {
        return helpers.message({ custom: '"subHeadingId should be null incase dataTypeCode is SHN' });
    }
    return value;
});

export const updateSubHeadingSchema = Joi.object({
    _id: Joi.string().required(),
    dataTypeCode: Joi.string().required().valid("SHN", "SHT"),
    sequenceNo: Joi.number().required(),
    chapterId: Joi.string().required(),
    subHeadingId: Joi.string().required().allow(null),
    content: Joi.string().required(),
    tagId: Joi.string().required().allow(null),
}).custom((value, helpers) => {
    if (value.dataTypeCode === "SHT" && value.subHeadingId == null) {
        return helpers.message({ custom: '"subHeadingId is required incase dataTypeCode is SHT' });
    }
    if (value.dataTypeCode === "SHN" && value.subHeadingId != null) {
        return helpers.message({ custom: '"subHeadingId should be null incase dataTypeCode is SHN' });
    }
    return value;
});


export const getSubHeadingSchema = Joi.object({
    chapterId: Joi.string().required()
});