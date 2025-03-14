import Joi from "joi";

export const createGroupSchema = Joi.object({
    dataTypeCode: Joi.string().required().valid("GPN", "GPT"),
    sequenceNo: Joi.number().required(),
    groupId: Joi.string().required().allow(""),
    content: Joi.string().required(),
    tagId: Joi.string().required().allow(null),
}).custom((value, helpers) => {
    if (value.dataTypeCode === "GPT" && value.groupId == "") {
        return helpers.message({ custom: '"groupId is required incase dataTypeCode is GPT' });
    }
    if (value.dataTypeCode === "GPN" && value.groupId != "") {
        return helpers.message({ custom: '"groupId should be empty string incase dataTypeCode is GPN' });
    }
    return value;
});

export const updateGroupSchema = Joi.object({
    _id: Joi.string().required(),
    dataTypeCode: Joi.string().required().valid("GPN", "GPT"),
    sequenceNo: Joi.number().required(),
    groupId: Joi.string().required().allow(""),
    content: Joi.string().required(),
    tagId: Joi.string().required().allow(null),
}).custom((value, helpers) => {
    if (value.dataTypeCode === "GPT" && value.groupId == "") {
        return helpers.message({ custom: '"groupId is required incase dataTypeCode is GPT' });
    }
    if (value.dataTypeCode === "GPN" && value.groupId != "") {
        return helpers.message({ custom: '"groupId should be empty string incase dataTypeCode is GPN' });
    }
    return value;
});
