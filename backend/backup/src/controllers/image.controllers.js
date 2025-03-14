import { imageServices } from "../services/image.services.js";
import asyncHandler from "../middlewares/asyncHandler.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const saveImage = asyncHandler(async (req, res, next) => {
    const savedImage = await imageServices.saveImage(req.file.filename);
    res.status(201).json(savedImage);
});

export const deleteImage = asyncHandler(async (req, res, next) => {
    const deletedImage = await imageServices.deleteImage(req.query._id);
    res.status(200).json(deletedImage);
});

export const getImageList = asyncHandler(async (req, res, next) => {
    const images = await imageServices.getImageList();
    res.status(200).json(images);
});

export const getImage = asyncHandler(async (req, res, next) => {
    const imageName = req.params.imageName;

    if (!imageName) {
        return res.status(400).json({ error: 'Image name is required' });
    }

    const imagePath = path.join(__dirname, '../../public/images', imageName);

    fs.access(imagePath, fs.constants.F_OK, (err) => {
        if (err) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Set the content-type header based on the file extension
        const fileExtension = path.extname(imageName).toLowerCase();
        const mimeTypes = {
            '.jpeg': 'image/jpeg',
            '.jpg': 'image/jpeg',
            '.png': 'image/png',
            '.gif': 'image/gif',
        };
        const contentType = mimeTypes[fileExtension] || 'application/octet-stream';
        res.setHeader('Content-Type', contentType);

        // Stream the image file to the response
        fs.createReadStream(imagePath).pipe(res);
    });
});