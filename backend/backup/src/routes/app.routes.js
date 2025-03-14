import { Router } from "express";
import authRoutes from './auth.routes.js';
import groupRoutes from './book/group.routes.js';
import tagRoutes from "./book/tag.routes.js";
import chapterRoutes from "./book/chapter.routes.js";
import subHeadingRoutes from "./book/subHeading.routes.js";
import subSubHeadingRoutes from "./book/subSubHeading.routes.js";
import imageRoutes from './image.routes.js';
import commonRoutes from "./book/common.routes.js";
import dbRoutes from "./db.routes.js";
import { authorize } from "../middlewares/authorize.js";
import { roles } from "../constant.js";
const router = Router();

//auth routes
router.use('/auth', authRoutes);

//book
router.use('/book/group', authorize([roles.ADMIN]), groupRoutes);
router.use('/book/tag', tagRoutes);
router.use('/book/chapter', authorize([roles.ADMIN]), chapterRoutes);
router.use('/book/subheading', authorize([roles.ADMIN]), subHeadingRoutes);
router.use('/book/subsubheading', authorize([roles.ADMIN]), subSubHeadingRoutes);
router.use('/book', commonRoutes)

//image
router.use('/image', imageRoutes);

//db
router.use('/db', authorize([roles.ADMIN]), dbRoutes);

export default router;