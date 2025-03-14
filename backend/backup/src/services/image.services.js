import Image from "../models/Image.js";
import createHttpError from "http-errors";

const saveImage = (filename) => {
    const newImage = new Image({ filename });
    return newImage.save();
};

const deleteImage = async (_id) => {
    // check if the image exists
    const existingImage = await Image.findById(_id);
    if (!existingImage) {
        throw createHttpError(404, 'Image not found');
    }

    existingImage.deletedAt = new Date();
    await existingImage.save();
    return existingImage;
};

const getImageList = async () => {
    const images = await Image.find();
    return images;
};

export const imageServices = {
    saveImage,
    deleteImage,
    getImageList
};