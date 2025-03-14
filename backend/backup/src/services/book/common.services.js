import Group from "../../models/Group.js";
import Chapter from "../../models/Chapter.js";
import SubHeading from "../../models/SubHeading.js";
import SubSubHeading from "../../models/SubSubHeading.js";

const getAllContent = async (groupId) => {
    // Step 1: Get all GPN records for the specified groupId
    let GPN = await Group.find({ _id: groupId })
        .select('_id dataTypeCode sequenceNo content tagId')
        .sort({ sequenceNo: 1 });

    // Step 2: For each GPN, fetch its associated GPT records and attach them to the GPN object
    const populatedGPN = await Promise.all(
        GPN.map(async (group) => {
            const GPT = await Group.find({ dataTypeCode: "GPT", groupId: group._id })
                .select('_id dataTypeCode sequenceNo groupId content tagId')
                .sort({ sequenceNo: 1 });

            group = group.toObject(); // Convert Mongoose document to a plain JS object
            group.GPT = GPT; // Add GPT array to the GPN object
            return group;
        })
    );

    // Step 3: Get all CHN records for the specified groupId
    const CHN = await Chapter.find({ groupId, dataTypeCode: "CHN" })
        .select('_id dataTypeCode sequenceNo groupId content tagId')
        .sort({ sequenceNo: 1 });

    // Step 4: For each CHN, fetch its associated CHT records and attach them to the CHN object
    const populatedCHN = await Promise.all(
        CHN.map(async (chapter) => {
            // Fetch CHT for each CHN
            const CHT = await Chapter.find({ groupId, dataTypeCode: "CHT", chapterId: chapter._id })
                .select('_id dataTypeCode sequenceNo groupId content tagId')
                .sort({ sequenceNo: 1 });

            chapter = chapter.toObject();
            chapter.CHT = CHT;

            // Step 5: For each CHN, fetch SHN (SubHeading) records and attach them
            const SHN = await SubHeading.find({ chapterId: chapter._id, dataTypeCode: "SHN" })
                .select('_id dataTypeCode sequenceNo chapterId content tagId')
                .sort({ sequenceNo: 1 });

            // For each SHN, fetch SHT (SubHeading Title) and attach it to SHN
            const populatedSHN = await Promise.all(
                SHN.map(async (subHeading) => {
                    const SHT = await SubHeading.find({ chapterId: chapter._id, dataTypeCode: "SHT", subHeadingId: subHeading._id })
                        .select('_id dataTypeCode sequenceNo chapterId subHeadingId content tagId')
                        .sort({ sequenceNo: 1 });

                    subHeading = subHeading.toObject();
                    subHeading.SHT = SHT;

                    // Step 6: For each SHN, fetch SSHN (Sub-SubHeading) records
                    const SSHN = await SubSubHeading.find({ subHeadingId: subHeading._id, dataTypeCode: "SSHN" })
                        .select('_id dataTypeCode sequenceNo subHeadingId content tagId')
                        .sort({ sequenceNo: 1 });

                    // For each SSHN, fetch SSHT (Sub-SubHeading Title) and attach it to SSHN
                    const populatedSSHN = await Promise.all(
                        SSHN.map(async (subSubHeading) => {
                            const SSHT = await SubSubHeading.find({ subHeadingId: subHeading._id, dataTypeCode: "SSHT", subSubHeadingId: subSubHeading._id })
                                .select('_id dataTypeCode sequenceNo subHeadingId subSubHeadingId content tagId')
                                .sort({ sequenceNo: 1 });

                            subSubHeading = subSubHeading.toObject();
                            subSubHeading.SSHT = SSHT;

                            return subSubHeading;
                        })
                    );

                    subHeading.SSHN = populatedSSHN; // Attach SSHN array to the SHN object
                    return subHeading;
                })
            );

            chapter.SHN = populatedSHN; // Attach SHN array to the CHN object
            return chapter;
        })
    );

    // Return the populated GPN and CHN arrays
    return { group: populatedGPN, chapter: populatedCHN };
};

const getNameListByGroupId = async (groupId) => {
    // Fetch GPN and CHN names for the specified groupId
    const CHN = await Chapter.find({ groupId, dataTypeCode: "CHN" })
        .select('_id dataTypeCode sequenceNo groupId content tagId')
        .sort({ sequenceNo: 1 });

    const populatedCHN = await Promise.all(
        CHN.map(async (chapter) => {

            chapter = chapter.toObject();
            const SHN = await SubHeading.find({ chapterId: chapter._id, dataTypeCode: "SHN" })
                .select('_id dataTypeCode sequenceNo chapterId content tagId')
                .sort({ sequenceNo: 1 });


            const populatedSHN = await Promise.all(
                SHN.map(async (subHeading) => {

                    subHeading = subHeading.toObject();
                    const SSHN = await SubSubHeading.find({ subHeadingId: subHeading._id, dataTypeCode: "SSHN" })
                        .select('_id dataTypeCode sequenceNo subHeadingId content tagId')
                        .sort({ sequenceNo: 1 });


                    const populatedSSHN = await Promise.all(
                        SSHN.map(async (subSubHeading) => {
                            subSubHeading = subSubHeading.toObject();
                            return subSubHeading;
                        })
                    );

                    subHeading.SSHN = populatedSSHN; // Attach SSHN array to the SHN object
                    return subHeading;
                })
            );

            chapter.SHN = populatedSHN; // Attach SHN array to the CHN object
            return chapter;
        })
    );

    return populatedCHN;

}

export const commonServices = {
    getAllContent,
    getNameListByGroupId
};