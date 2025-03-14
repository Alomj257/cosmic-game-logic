const express = require("express");
const { 
    createTag, 
    updateTag, 
    deleteTag, 
    getTags, 
    getTagsByType, 
    getTagById 
} = require("../controllers/tagsController");

const router = express.Router();

router.post("/create", createTag);
router.put("/update", updateTag);
router.delete("/delete/:id", deleteTag);
router.get("/list", getTags);
router.get("/list/:dataTypeCode", getTagsByType);
router.get("/:id", getTagById);

module.exports = router;
