import { Router } from "express";
import { getCollectionList, getData } from "../controllers/db.controllers.js";
import { validateQuery } from "../middlewares/validation.js";
import { getDataSchema } from "../validationSchema/db.js";
const router = Router();

router.route('/getcollections').get(getCollectionList);
router.route('/getdata').get(validateQuery(getDataSchema), getData);

export default router;