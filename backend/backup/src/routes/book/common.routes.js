import { Router } from "express";
import { getAllContent, getNameListByGroupId } from "../../controllers/book/common.controller.js";
const router = Router();

router.route('/getallcontent/:groupId').get(getAllContent);

router.route('/getnamelist/:groupId').get(getNameListByGroupId);

export default router;