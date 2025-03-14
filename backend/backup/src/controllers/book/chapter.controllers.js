import { chapterServices } from "../../services/book/chapter.services.js";
import asyncHandler from "../../middlewares/asyncHandler.js";

export const createChapter = asyncHandler(async (req, res, next) => {
    const newChapter = await chapterServices.createChapter(req.body);
    res.status(201).json(newChapter);
});

export const updateChapter = asyncHandler(async (req, res, next) => {
    const updatedChapter = await chapterServices.updateChapter(req.body);
    res.status(200).json(updatedChapter);
});

export const deleteChapter = asyncHandler(async (req, res, next) => {
    const deletedChapter = await chapterServices.deleteChapter(req.params._id);
    res.status(200).json(deletedChapter);
});

export const getChapterNameList = asyncHandler(async (req, res, next) => {
    const chapters = await chapterServices.getChapterNameList(req.query.groupId);
    res.status(200).json(chapters);
});

export const getAllChapters = asyncHandler(async (req, res, next) => {
    const chapters = await chapterServices.getAllChapters(req.query.groupId);
    res.status(200).json(chapters);
});

export const getSequenceNumberList = asyncHandler(async (req, res, next) => {
    const { chn, cht } = await chapterServices.getSequenceNumberList(req.query.groupId);
    res.status(200).json({ CHN: chn, CHT: cht });
});