const express = require("express");
const router = express.Router();
const {
  getPhotos,
  getPhotoById,
  getCountPT,
  UploadPhoto,
  writeCM,
} = require("../controllers/PhotoController.js");
router.post("/photo", UploadPhoto);
router.post("/comment", writeCM);

router.get("/", getPhotos);
router.get("/:id", getPhotoById);
router.get("/getCountPT/:id", getCountPT);

module.exports = router;
