import Joi from "joi";

export const getDataSchema = Joi.object({
    collection: Joi.string().required()
});