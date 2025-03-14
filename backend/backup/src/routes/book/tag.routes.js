import { Router } from "express";
import { validate, validateQuery } from "../../middlewares/validation.js";
import { createTagSchema, getTagListOfNamesSchema, getTagListOfTextsSchema, updateTagSchema } from "../../validationSchema/book/tag.js";
import { createTag, getTagList, updateTag, deleteTag, getTagListOfNames, getTagListOfTexts, getTagById } from "../../controllers/book/tag.controllers.js";
import { authorize } from "../../middlewares/authorize.js";
import { roles } from "../../constant.js";
const router = Router();

router.route('/create').post(authorize([roles.ADMIN]), validate(createTagSchema), createTag);

router.route('/update').put(authorize([roles.ADMIN]), validate(updateTagSchema), updateTag);

router.route('/gettaglist').get(getTagList);

router.route('/deletetag/:_id').delete(authorize([roles.ADMIN]), deleteTag);

router.route('/gettaglistofnames').get(validateQuery(getTagListOfNamesSchema), getTagListOfNames);

router.route('/gettaglistoftexts').get(validateQuery(getTagListOfTextsSchema), getTagListOfTexts);

router.route('/gettag/:_id').get(getTagById);

export default router;