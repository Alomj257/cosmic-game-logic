import { commonServices } from "../../services/book/common.services.js";
import asyncHandler from "../../middlewares/asyncHandler.js";

export const getAllContent = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const content = await commonServices.getAllContent(groupId);
    res.status(200).json(content);
});

export const getNameListByGroupId = asyncHandler(async (req, res, next) => {
    const { groupId } = req.params;
    const names = await commonServices.getNameListByGroupId(groupId);
    res.status(200).json(names);
});