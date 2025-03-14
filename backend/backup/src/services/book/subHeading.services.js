import createHttpError from "http-errors";
import SubHeading from "../../models/SubHeading.js";

const createSubHeading = async (obj) => {
    const { dataTypeCode, chapterId, sequenceNo, subHeadingId, content, tagId } = obj;

    //check if the subheading already exists
    const existingSubHeading = await SubHeading.findOne({
        chapterId,
        sequenceNo,
        subHeadingId: subHeadingId || null,
    });
    if (existingSubHeading) {
        throw createHttpError(400, `Subheading sequence number ${sequenceNo} already exists for ${dataTypeCode} of chapterId ${chapterId}`);
    }

    const newSubHeading = new SubHeading({ ...obj });
    await newSubHeading.save();
    return newSubHeading;
};

const updateSubHeading = async (obj) => {
    const { _id, dataTypeCode, chapterId, sequenceNo, subHeadingId, content, tagId } = obj;

    //check if the subheading exists
    const existingSubHeading = await SubHeading.findById(_id);
    if (!existingSubHeading) {
        throw createHttpError(404, `Subheading with _id ${_id} not found`);
    }

    //check if the subheading combination already exists
    const existingSubHeadingCombination = await SubHeading.findOne({
        chapterId,
        sequenceNo,
        subHeadingId: subHeadingId || null,
        _id: { $ne: _id },
    });
    if (existingSubHeadingCombination) {
        throw createHttpError(400, `Subheading sequence number ${sequenceNo} for ${dataTypeCode} already exists of chapterId ${chapterId}`);
    }

    existingSubHeading.dataTypeCode = dataTypeCode;
    existingSubHeading.chapterId = chapterId;
    existingSubHeading.sequenceNo = sequenceNo;
    existingSubHeading.subHeadingId = subHeadingId || null;
    existingSubHeading.content = content;
    existingSubHeading.tagId = tagId;

    await existingSubHeading.save();
    return existingSubHeading;
};

const deleteSubHeading = async (_id) => {
    //check if the Subheading exists
    const existingSubHeading = await SubHeading.findById(_id);
    if (!existingSubHeading) {
        throw createHttpError(404, 'Subheading not found');
    }

    existingSubHeading.deletedAt = new Date();
    await existingSubHeading.save();
    return existingSubHeading;
};

const getSubHeadingNameList = async (chapterId) => {
    const subHeadings = await SubHeading.find({ dataTypeCode: 'SHN', chapterId })
        .select('_id sequenceNo chapterId content')
        .sort({ sequenceNo: 1 });
    return subHeadings;
};

const getAllSubHeadings = async (chapterId) => {
    const subHeadings = await SubHeading.find({ chapterId })
        .select('_id dataTypeCode sequenceNo chapterId subHeadingId content tagId')
        .sort({ sequenceNo: 1, dataTypeCode: 1 });

    const orderedSubHeadings = subHeadings.sort((a, b) => {
        if (a.sequenceNo === b.sequenceNo) {
            return a.dataTypeCode === 'SHN' ? -1 : 1;
        }
        return a.sequenceNo - b.sequenceNo;
    });

    return orderedSubHeadings;
};

const getSequenceNumberList = async (chapterId) => {
    const shn = await SubHeading.find({ dataTypeCode: "SHN", chapterId })
        .select('_id sequenceNo chapterId subHeadingId content tagId')
        .sort({ sequenceNo: 1 });
    const sht = await SubHeading.find({ dataTypeCode: "SHT", chapterId })
        .select('_id sequenceNo chapterId subHeadingId content tagId')
        .sort({ sequenceNo: 1 });
    return { shn, sht };
};

export const subHeadingServices = {
    createSubHeading,
    updateSubHeading,
    deleteSubHeading,
    getSubHeadingNameList,
    getAllSubHeadings,
    getSequenceNumberList,
};
