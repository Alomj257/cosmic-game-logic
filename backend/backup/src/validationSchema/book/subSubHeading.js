import Joi from "joi";

export const createSubSubHeadingSchema = Joi.object({
    dataTypeCode: Joi.string().required().valid("SSHN", "SSHT"),
    sequenceNo: Joi.number().required(),
    subHeadingId: Joi.string().required(),
    subSubHeadingId: Joi.string().required().allow(null),
    content: Joi.string().required(),
    tagId: Joi.string().required().allow(null),
}).custom((value, helpers) => {
    if (value.dataTypeCode === "SSHT" && value.subSubHeadingId == null) {
        return helpers.message({ custom: '"subSubHeadingId is required incase dataTypeCode is SSHT' });
    }
    if (value.dataTypeCode === "SSHN" && value.subSubHeadingId != null) {
        return helpers.message({ custom: '"subSubHeadingId should be null incase dataTypeCode is SSHN' });
    }
    return value;
});

export const updateSubSubHeadingSchema = Joi.object({
    _id: Joi.string().required(),
    dataTypeCode: Joi.string().required().valid("SSHN", "SSHT"),
    sequenceNo: Joi.number().required(),
    subHeadingId: Joi.string().required(),
    subSubHeadingId: Joi.string().required().allow(null),
    content: Joi.string().required(),
    tagId: Joi.string().required().allow(null),
}).custom((value, helpers) => {
    if (value.dataTypeCode === "SSHT" && value.subSubHeadingId == null) {
        return helpers.message({ custom: '"subSubHeadingId is required incase dataTypeCode is SSHT' });
    }
    if (value.dataTypeCode === "SSHN" && value.subSubHeadingId != null) {
        return helpers.message({ custom: '"subSubHeadingId should be null incase dataTypeCode is SSHN' });
    }
    return value;
});


export const getSubSubHeadingSchema = Joi.object({
    subHeadingId: Joi.string().required()
});