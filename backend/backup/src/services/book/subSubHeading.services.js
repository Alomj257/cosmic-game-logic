import createHttpError from "http-errors";
import SubSubHeading from "../../models/SubSubHeading.js";


const createSubSubHeading = async (obj) => {
    const { dataTypeCode, subHeadingId, sequenceNo, subSubHeadingId, content, tagId } = obj;

    // check if the subsubheading already exists
    const existingSubSubHeading = await SubSubHeading.findOne({
        subHeadingId,
        sequenceNo,
        subSubHeadingId: subSubHeadingId || null,
    });
    if (existingSubSubHeading) {
        throw createHttpError(400, `Subsubheading sequence number ${sequenceNo} already exists for ${dataTypeCode} of subheadingId ${subHeadingId}`);
    }
    const newSubSubHeading = new SubSubHeading({ ...obj });
    await newSubSubHeading.save();
    return newSubSubHeading;
};

const updateSubSubHeading = async (obj) => {
    const { _id, dataTypeCode, subHeadingId, sequenceNo, subSubHeadingId, content, tagId } = obj;

    // check if the subsubheading exists
    const existingSubSubHeading = await SubSubHeading.findById(_id);
    if (!existingSubSubHeading) {
        throw createHttpError(404, `Subsubheading with _id ${_id} not found`);
    }

    // check if the subsubheading combination already exists
    const existingSubSubHeadingCombination = await SubSubHeading.findOne({
        subHeadingId,
        sequenceNo,
        subSubHeadingId: subSubHeadingId || null,
        _id: { $ne: _id },
    });
    if (existingSubSubHeadingCombination) {
        throw createHttpError(400, `Subsubheading sequence number ${sequenceNo} for ${dataTypeCode} already exists of subheadingId ${subHeadingId}`);
    }

    existingSubSubHeading.dataTypeCode = dataTypeCode;
    existingSubSubHeading.subHeadingId = subHeadingId;
    existingSubSubHeading.sequenceNo = sequenceNo;
    existingSubSubHeading.subSubHeadingId = subSubHeadingId || null;
    existingSubSubHeading.content = content;
    existingSubSubHeading.tagId = tagId;

    await existingSubSubHeading.save();
    return existingSubSubHeading;
};

const deleteSubSubHeading = async (_id) => {
    // check if the SubSubheading exists
    const existingSubSubHeading = await SubSubHeading.findById(_id);
    if (!existingSubSubHeading) {
        throw createHttpError(404, 'Subsubheading not found');
    }

    existingSubSubHeading.deletedAt = new Date();
    await existingSubSubHeading.save();
    return existingSubSubHeading;
};

const getSubSubHeadingNameList = async (subHeadingId) => {
    const subSubHeadings = await SubSubHeading.find({ dataTypeCode: 'SSHN', subHeadingId })
        .select('_id sequenceNo subHeadingId content')
        .sort({ sequenceNo: 1 });
    return subSubHeadings;
};

const getAllSubSubHeadings = async (subHeadingId) => {
    const subSubHeadings = await SubSubHeading.find({ subHeadingId })
        .select('_id dataTypeCode sequenceNo subHeadingId subSubHeadingId content tagId')
        .sort({ sequenceNo: 1, dataTypeCode: 1 });

    const orderedSubSubHeadings = subSubHeadings.sort((a, b) => {
        if (a.sequenceNo === b.sequenceNo) {
            return a.dataTypeCode === 'SSHN' ? -1 : 1;
        }
        return a.sequenceNo - b.sequenceNo;
    });

    return orderedSubSubHeadings;
};

const getSequenceNumberList = async (subHeadingId) => {
    const SSHN = await SubSubHeading.find({ dataTypeCode: "SSHN", subHeadingId })
        .select('_id sequenceNo subHeadingId subSubHeadingId content tagId')
        .sort({ sequenceNo: 1 });
    const SSHT = await SubSubHeading.find({ dataTypeCode: "SSHT", subHeadingId })
        .select('_id sequenceNo subHeadingId subSubHeadingId content tagId')
        .sort({ sequenceNo: 1 });
    return { SSHN, SSHT };
};

export const subSubHeadingServices = {
    createSubSubHeading,
    updateSubSubHeading,
    deleteSubSubHeading,
    getSubSubHeadingNameList,
    getAllSubSubHeadings,
    getSequenceNumberList,
};