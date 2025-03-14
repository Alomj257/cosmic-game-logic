import { Router } from "express";
import { validate, validateQuery } from "../../middlewares/validation.js";
import { createSubSubHeadingSchema, getSubSubHeadingSchema, updateSubSubHeadingSchema } from "../../validationSchema/book/subSubHeading.js";
import { createSubSubHeading, deleteSubSubHeading, getAllSubSubHeadings, getSequenceNumberList, getSubSubHeadingNameList, updateSubSubHeading } from "../../controllers/book/subSubHeading.controllers.js";
const router = Router();

router.route('/createsubsubheading').post(validate(createSubSubHeadingSchema), createSubSubHeading);

router.route('/updatesubsubheading').put(validate(updateSubSubHeadingSchema), updateSubSubHeading);

router.route('/deletesubsubheading/:_id').delete(deleteSubSubHeading);

router.route('/getsubsubheadingnamelist').get(validateQuery(getSubSubHeadingSchema), getSubSubHeadingNameList);

router.route('/getsubsubheadinglist').get(validateQuery(getSubSubHeadingSchema), getAllSubSubHeadings);

router.route('/getsequencenolist').get(validateQuery(getSubSubHeadingSchema), getSequenceNumberList);

export default router;