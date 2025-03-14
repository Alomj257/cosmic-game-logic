import asyncHandler from "../../middlewares/asyncHandler.js";
import { subHeadingServices } from "../../services/book/subHeading.services.js";

export const createSubHeading = asyncHandler(async (req, res, next) => {
    const newSubheading = await subHeadingServices.createSubHeading(req.body);
    res.status(201).json(newSubheading);
});

export const updateSubHeading = asyncHandler(async (req, res, next) => {
    const updatedSubheading = await subHeadingServices.updateSubHeading(req.body);
    res.status(200).json(updatedSubheading);
});

export const deleteSubHeading = asyncHandler(async (req, res, next) => {
    const deletedSubheading = await subHeadingServices.deleteSubHeading(req.params._id);
    res.status(200).json(deletedSubheading);
});

export const getSubHeadingNameList = asyncHandler(async (req, res, next) => {
    const subHeadings = await subHeadingServices.getSubHeadingNameList(req.query.chapterId);
    res.status(200).json(subHeadings);
});

export const getAllSubHeadings = asyncHandler(async (req, res, next) => {
    const subHeadings = await subHeadingServices.getAllSubHeadings(req.query.chapterId);
    res.status(200).json(subHeadings);
});

export const getSequenceNumberList = asyncHandler(async (req, res, next) => {
    const { shn, sht } = await subHeadingServices.getSequenceNumberList(req.query.chapterId);
    res.status(200).json({ SHN: shn, SHT: sht });
});