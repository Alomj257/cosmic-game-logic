import { groupServices } from "../../services/book/group.services.js";
import asyncHandler from "../../middlewares/asyncHandler.js";

export const createGroup = asyncHandler(async (req, res, next) => {
    const newGroup = await groupServices.createGroup(req.body);
    res.status(201).json(newGroup);
});

export const updateGroup = asyncHandler(async (req, res, next) => {
    const updatedGroup = await groupServices.updateGroup(req.body);
    res.status(200).json(updatedGroup);
});

export const deleteGroup = asyncHandler(async (req, res, next) => {
    const deletedGroup = await groupServices.deleteGroup(req.params._id);
    res.status(200).json(deletedGroup);
});

export const getGroupNameList = asyncHandler(async (req, res, next) => {
    const groups = await groupServices.getGroupNameList();
    res.status(200).json(groups);
});

export const getAllGroups = asyncHandler(async (req, res, next) => {
    const groups = await groupServices.getAllGroups();
    res.status(200).json(groups);
});

export const getSequenceNumberList = asyncHandler(async (req, res, next) => {
    const { gpn, gpt } = await groupServices.getSequenceNumberList();
    res.status(200).json({ GPN: gpn, GPT: gpt });
});