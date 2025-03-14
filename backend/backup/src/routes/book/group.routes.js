import { Router } from "express";
import { validate } from "../../middlewares/validation.js";
import { createGroup, deleteGroup, getAllGroups, getGroupNameList, getSequenceNumberList, updateGroup } from "../../controllers/book/group.controllers.js";
import { createGroupSchema, updateGroupSchema } from "../../validationSchema/book/group.js";
const router = Router();

router.route('/creategroup').post(validate(createGroupSchema), createGroup);

router.route('/updategroup').put(validate(updateGroupSchema), updateGroup);

router.route('/deletegroup/:_id').delete(deleteGroup);

router.route('/getgroupnamelist').get(getGroupNameList);

router.route('/getgrouplist').get(getAllGroups);

router.route('/getsequencenolist').get(getSequenceNumberList);

export default router;