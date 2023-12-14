const { Router } = require("express");
const { uploadImage, getImage, deleteImage } = require("../controller/uploadImagesController")
const multer = require("multer");

const imagesRouter = Router();
const upload = multer();

imagesRouter.post("/upload", upload.single('image'), uploadImage);
imagesRouter.get("/get/:id", getImage);
imagesRouter.delete("/delete/:id", deleteImage);

module.exports = imagesRouter;