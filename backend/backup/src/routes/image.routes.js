import { Router } from "express";
import { saveImage, deleteImage, getImageList, getImage } from "../controllers/image.controllers.js";
import imageUpload from "../config/multerConfig.js";
import { authorize } from "../middlewares/authorize.js";
import { roles } from "../constant.js";
const router = Router();

router.route('/saveimage').post(authorize([roles.ADMIN]),imageUpload.single('image'), saveImage);
router.route('/deleteimage').post(authorize([roles.ADMIN]), deleteImage);
router.route('/getimagelist').get(authorize([roles.ADMIN]), getImageList);

router.route('/:imageName').get(getImage);

export default router;