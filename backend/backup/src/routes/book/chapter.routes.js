import { Router } from "express";
import { validate, validateQuery } from "../../middlewares/validation.js";
import { createChapter, deleteChapter, getAllChapters, getChapterNameList, updateChapter, getSequenceNumberList } from "../../controllers/book/chapter.controllers.js";
import { createChapterSchema, getChapterSchema, updateChapterSchema } from "../../validationSchema/book/chapter.js";
const router = Router();

router.route('/createchapter').post(validate(createChapterSchema), createChapter);

router.route('/updatechapter').put(validate(updateChapterSchema), updateChapter);

router.route('/deletechapter/:_id').delete(deleteChapter);

router.route('/getchapternamelist').get(validateQuery(getChapterSchema), getChapterNameList);

router.route('/getchapterlist').get(validateQuery(getChapterSchema), getAllChapters);

router.route('/getsequencenolist').get(validateQuery(getChapterSchema), getSequenceNumberList);

export default router;