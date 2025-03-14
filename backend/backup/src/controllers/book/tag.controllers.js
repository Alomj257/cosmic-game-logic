import { tagServices } from "../../services/book/tag.services.js";
import asyncHandler from "../../middlewares/asyncHandler.js";

export const createTag = asyncHandler(async (req, res, next) => {
    const newTag = await tagServices.create(req.body);
    res.status(201).json(newTag);
});

export const updateTag = asyncHandler(async (req, res, next) => {
    const updatedTag = await tagServices.update(req.body);
    res.status(200).json(updatedTag);
});

export const getTagList = asyncHandler(async (req, res, next) => {
    const tags = await tagServices.getTagList();
    res.status(200).json(tags);
});

export const deleteTag = asyncHandler(async (req, res, next) => {
    const deletedTag = await tagServices.deleteTag(req.params._id);
    res.status(200).json(deletedTag);
});

export const getTagListOfNames = asyncHandler(async (req, res, next) => {
    const tags = await tagServices.getTagListByDataTypeCode(req.query.dataTypeCode);
    res.status(200).json(tags);
});

export const getTagListOfTexts = asyncHandler(async (req, res, next) => {
    const tags = await tagServices.getTagListByDataTypeCode(req.query.dataTypeCode);
    res.status(200).json(tags);
});

export const getTagById = asyncHandler(async (req, res, next) => {
    const tag = await tagServices.getTagById(req.params._id);
    res.status(200).json(tag);
});