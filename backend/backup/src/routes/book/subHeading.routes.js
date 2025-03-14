import { Router } from "express";
import { validate, validateQuery } from "../../middlewares/validation.js";
import { createSubHeading, deleteSubHeading, getAllSubHeadings, getSequenceNumberList, getSubHeadingNameList, updateSubHeading } from "../../controllers/book/subHeading.controllers.js";
import { createSubHeadingSchema, getSubHeadingSchema, updateSubHeadingSchema } from "../../validationSchema/book/subHeading.js";
const router = Router();

router.route('/createsubheading').post(validate(createSubHeadingSchema), createSubHeading);

router.route('/updatesubheading').put(validate(updateSubHeadingSchema), updateSubHeading);

router.route('/deletesubheading/:_id').delete(deleteSubHeading);

router.route('/getsubheadingnamelist').get(validateQuery(getSubHeadingSchema), getSubHeadingNameList);

router.route('/getsubheadinglist').get(validateQuery(getSubHeadingSchema), getAllSubHeadings);

router.route('/getsequencenolist').get(validateQuery(getSubHeadingSchema), getSequenceNumberList);

export default router;