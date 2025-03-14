import mongoose from "mongoose";
import Group from "../models/Group.js";
import Chapter from "../models/Chapter.js";
import SubHeading from "../models/SubHeading.js";
import SubSubHeading from "../models/SubSubHeading.js";
import Tag from "../models/Tag.js";
import Image from "../models/Image.js";
import User from "../models/User.js";

const getColumnNames = (model) => {
    const schemaPaths = model.schema.paths;
    return Object.keys(schemaPaths).filter((key) => key !== "__v"); // Exclude internal fields like `__v`
};

const getCollectionList = async () => {
    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map((collection) => collection.name);
    return collectionNames;
};

const getFormattedData = async (model, columnNames) => {
    const data = await model.find().setOptions({ includeDeleted: true });
    return data.map((doc) => {
        const docObject = doc.toObject({ getters: true });
        return columnNames.map((column) => {
            const value = docObject[column];

            if (value && mongoose.Types.ObjectId.isValid(value)) {
                return value.toString();
            }
            return value || null;
        });
    });
};



const getData = async (collection) => {
    switch (collection) {
        case "groups": {
            const columnNames = getColumnNames(Group);
            const data = await getFormattedData(Group, columnNames);
            return { columnNames, data };
        }
        case "chapters": {
            const columnNames = getColumnNames(Chapter);
            const data = await getFormattedData(Chapter, columnNames);
            return { columnNames, data };
        }
        case "subheadings": {
            const columnNames = getColumnNames(SubHeading);
            const data = await getFormattedData(SubHeading, columnNames);
            return { columnNames, data };
        }
        case "subsubheadings": {
            const columnNames = getColumnNames(SubSubHeading);
            const data = await getFormattedData(SubSubHeading, columnNames);
            return { columnNames, data };
        }
        case "tags": {
            const columnNames = getColumnNames(Tag);
            const data = await getFormattedData(Tag, columnNames);
            return { columnNames, data };
        }
        case "images": {
            const columnNames = getColumnNames(Image);
            const data = await getFormattedData(Image, columnNames);
            return { columnNames, data };
        }
        case "users": {
            const columnNames = getColumnNames(User);
            const data = await getFormattedData(User, columnNames);
            return { columnNames, data };
        }
        default:
            return { message: "Invalid collection" };
    }
};

export const dbServices = {
    getCollectionList,
    getData
};