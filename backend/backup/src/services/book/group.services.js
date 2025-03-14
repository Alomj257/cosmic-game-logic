import createHttpError from "http-errors";
import Group from "../../models/Group.js";

const createGroup = async (obj) => {
    const { dataTypeCode, sequenceNo, groupId, content, tagId } = obj;

    //check if the group already exists
    const existingGroup = await Group.findOne({
        ...(groupId == "" ? { dataTypeCode, sequenceNo } : { dataTypeCode, sequenceNo, groupId })
    });
    if (existingGroup) {
        throw createHttpError(400, `Sequence number ${sequenceNo} already exists for ${dataTypeCode}`);
    }

    const newGroup = new Group({ ...(groupId == "" ? { dataTypeCode, sequenceNo, content, tagId } : obj) });
    await newGroup.save();
    return newGroup;
};

const updateGroup = async (obj) => {
    const { _id, dataTypeCode, sequenceNo, groupId, content, tagId } = obj;

    //check if the group exists
    const existingGroup = await Group.findById(_id);
    if (!existingGroup) {
        throw createHttpError(404, `Data with _id ${_id} not found`);
    }

    //check if the group combination already exists
    const existingGroupCombination = await Group.findOne({
        ...(groupId == "" ? { dataTypeCode, sequenceNo, _id: { $ne: _id } } : { dataTypeCode, sequenceNo, groupId, _id: { $ne: _id } })
    });
    if (existingGroupCombination) {
        throw createHttpError(400, `Sequence number ${sequenceNo} for ${dataTypeCode} already exists`);
    }

    existingGroup.dataTypeCode = dataTypeCode;
    existingGroup.sequenceNo = sequenceNo;
    existingGroup.content = content;
    existingGroup.tagId = tagId;
    if (groupId !== "") {
        existingGroup.groupId = groupId;
    }
    await existingGroup.save();
    return existingGroup;
};

const deleteGroup = async (_id) => {
    //check if the group exists
    const existingGroup = await Group.findOne({ _id });
    if (!existingGroup) {
        throw createHttpError(404, 'Group not found');
    }

    existingGroup.deletedAt = new Date();
    await existingGroup.save();
    return existingGroup;
};

const getGroupNameList = async () => {
    const groups = await Group.find({ dataTypeCode: 'GPN' })
        .select('_id sequenceNo content')
        .sort({ sequenceNo: 1 });
    return groups;
};

const getAllGroups = async () => {
    const groups = await Group.find()
        .select('_id dataTypeCode sequenceNo groupId content tagId')
        .sort({ sequenceNo: 1, dataTypeCode: 1 });

    // Reorder so that for each sequenceNo, 'GPN' comes first, then 'GPT'
    const orderedGroups = groups.sort((a, b) => {
        if (a.sequenceNo === b.sequenceNo) {
            return a.dataTypeCode === 'GPN' ? -1 : 1; // Ensure GPN comes before GPT
        }
        return a.sequenceNo - b.sequenceNo; // Sort by groupNo
    });

    return orderedGroups;
};

const getSequenceNumberList = async () => {
    const gpn = await Group.find({ dataTypeCode: "GPN" })
        .select('_id sequenceNo groupId content tagId')
        .sort({ sequenceNo: 1 });
    const gpt = await Group.find({ dataTypeCode: "GPT" })
        .select('_id sequenceNo groupId content tagId')
        .sort({ sequenceNo: 1 });
    return { gpn, gpt };
}

export const groupServices = {
    createGroup,
    updateGroup,
    deleteGroup,
    getGroupNameList,
    getAllGroups,
    getSequenceNumberList
};