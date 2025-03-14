import asyncHandler from "../middlewares/asyncHandler.js";
import { dbServices } from "../services/db.services.js";

export const getCollectionList = asyncHandler(async (req, res, next) => {
    const collections = await dbServices.getCollectionList();
    res.status(200).json(collections);
});

export const getData = asyncHandler(async (req, res, next) => {
    const { collection } = req.query;
    const data = await dbServices.getData(collection);
    res.status(200).json(data);
});