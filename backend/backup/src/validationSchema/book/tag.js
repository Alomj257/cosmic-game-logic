import Joi from "joi";

export const createTagSchema = Joi.object({
    dataTypeCode: Joi.string().required().valid("GPN", "GPT", "CHN", "CHT", "SHN", "SHT", "SSHN", "SSHT"),
    openingTag: Joi.string().required(),
    closingTag: Joi.string().required(),
    isDefault: Joi.boolean().required(),
});

export const updateTagSchema = Joi.object({
    _id: Joi.string().required(),
    dataTypeCode: Joi.string().required().valid("GPN", "GPT", "CHN", "CHT", "SHN", "SHT", "SSHN", "SSHT"),
    openingTag: Joi.string().required(),
    closingTag: Joi.string().required(),
    isDefault: Joi.boolean().required(),
});


export const getTagListOfNamesSchema = Joi.object({
    dataTypeCode: Joi.string().valid("GPN", "CHN", "SHN", "SSHN").required(),
});

export const getTagListOfTextsSchema = Joi.object({
    dataTypeCode: Joi.string().valid("GPT", "CHT", "SHT", "SSHT").required(),
});