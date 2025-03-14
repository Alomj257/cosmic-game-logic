import asyncHandler from "../../middlewares/asyncHandler.js";
import { subSubHeadingServices } from "../../services/book/subSubHeading.services.js";

export const createSubSubHeading = asyncHandler(async (req, res, next) => {
    const newSubSubHeading = await subSubHeadingServices.createSubSubHeading(req.body);
    res.status(201).json(newSubSubHeading);
});

export const updateSubSubHeading = asyncHandler(async (req, res, next) => {
    const updatedSubSubHeading = await subSubHeadingServices.updateSubSubHeading(req.body);
    res.status(200).json(updatedSubSubHeading);
});

export const deleteSubSubHeading = asyncHandler(async (req, res, next) => {
    const deletedSubSubHeading = await subSubHeadingServices.deleteSubSubHeading(req.params._id);
    res.status(200).json(deletedSubSubHeading);
});

export const getSubSubHeadingNameList = asyncHandler(async (req, res, next) => {
    const subSubHeadings = await subSubHeadingServices.getSubSubHeadingNameList(req.query.subHeadingId);
    res.status(200).json(subSubHeadings);
});

export const getAllSubSubHeadings = asyncHandler(async (req, res, next) => {
    const subSubHeadings = await subSubHeadingServices.getAllSubSubHeadings(req.query.subHeadingId);
    res.status(200).json(subSubHeadings);
});

export const getSequenceNumberList = asyncHandler(async (req, res, next) => {
    const { SSHN, SSHT } = await subSubHeadingServices.getSequenceNumberList(req.query.subHeadingId);
    res.status(200).json({ SSHN, SSHT });
});

