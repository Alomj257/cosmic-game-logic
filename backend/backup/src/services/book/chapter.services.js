import createHttpError from "http-errors";
import Chapter from "../../models/Chapter.js";

const createChapter = async (obj) => {
    const { dataTypeCode, sequenceNo, groupId, chapterId, content, tagId } = obj;

    //check if the chapter already exists
    const existingChapter = await Chapter.findOne({
        ...(chapterId ? { dataTypeCode, sequenceNo, groupId, chapterId } : { dataTypeCode, sequenceNo, groupId })
    });
    if (existingChapter) {
        throw createHttpError(400, `Sequence number ${sequenceNo} already exists for ${dataTypeCode} of groupId ${groupId}`);
    }

    const newChapter = new Chapter({ ...(chapterId ? obj : { dataTypeCode, sequenceNo, content, groupId, tagId }) });
    await newChapter.save();
    return newChapter;
};

const updateChapter = async (obj) => {
    const { _id, dataTypeCode, sequenceNo, groupId, chapterId, content, tagId } = obj;

    //check if the chapter exists
    const existingChapter = await Chapter.findById(_id);
    if (!existingChapter) {
        throw createHttpError(404, `Data with _id ${_id} not found`);
    }

    //check if the chapter combination already exists
    const existingChapterCombination = await Chapter.findOne({
        ...(chapterId ? { dataTypeCode, sequenceNo, groupId, chapterId, _id: { $ne: _id } } : { dataTypeCode, sequenceNo, groupId, _id: { $ne: _id } })
    });
    if (existingChapterCombination) {
        throw createHttpError(400, `Sequence number ${sequenceNo} for ${dataTypeCode} already exists of groupId ${groupId}`);
    }

    existingChapter.dataTypeCode = dataTypeCode;
    existingChapter.sequenceNo = sequenceNo;
    existingChapter.content = content;
    existingChapter.groupId = groupId;
    existingChapter.tagId = tagId;
    if (chapterId) {
        existingChapter.chapterId = chapterId;
    }
    await existingChapter.save();
    return existingChapter;
};

const deleteChapter = async (_id) => {
    //check if the Chapter exists
    const existingChapter = await Chapter.findOne({ _id });
    if (!existingChapter) {
        throw createHttpError(404, 'Chapter not found');
    }

    existingChapter.deletedAt = new Date();
    await existingChapter.save();
    return existingChapter;
};

const getChapterNameList = async (groupId) => {
    const chapters = await Chapter.find({ dataTypeCode: 'CHN', groupId })
        .select('_id sequenceNo groupId content')
        .sort({ sequenceNo: 1 });
    return chapters;
};

const getAllChapters = async (groupId) => {
    const chapters = await Chapter.find({ groupId })
        .select('_id dataTypeCode sequenceNo groupId chapterId content tagId')
        .sort({ sequenceNo: 1, dataTypeCode: 1 });

    const orderedChapters = chapters.sort((a, b) => {
        if (a.sequenceNo === b.sequenceNo) {
            return a.dataTypeCode === 'CHN' ? -1 : 1;
        }
        return a.sequenceNo - b.sequenceNo;
    });

    return orderedChapters;
};

const getSequenceNumberList = async (groupId) => {
    const chn = await Chapter.find({ dataTypeCode: "CHN", groupId })
        .select('_id sequenceNo groupId chapterId content tagId')
        .sort({ sequenceNo: 1 });
    const cht = await Chapter.find({ dataTypeCode: "CHT", groupId })
        .select('_id sequenceNo groupId chapterId content tagId')
        .sort({ sequenceNo: 1 });
    return { chn, cht };
};


export const chapterServices = {
    createChapter,
    updateChapter,
    deleteChapter,
    getChapterNameList,
    getAllChapters,
    getSequenceNumberList
};

