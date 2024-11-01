const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
const s3Service = require("../services/s3.service");
const auth = require("../middlewares/auth");
const messages = require("../messages.json");

// Image upload.
router.post(
  "/upload",
  auth(),
  upload.single("image"),
  /*
    #swagger.tags = ['Upload']
    #swagger.description = 'Image upload API'
    #swagger.consumes = ['multipart/form-data']
  
    #swagger.parameters['image'] = {
        in: 'formData',
        name: 'image',
        type: 'file',
        required: true,
        description: 'Image file to upload.'
    }

    #swagger.security = [{
        "apiKeyAuth": []
    }]
  */
  async (req, res) => {
    const file = req.file;
    const result = await s3Service.uploadFileToS3(file, req.body.path);

    if (result) {
      return res.status(200).send({
        serverResponse: {
          code: 200,
          message: messages.IMAGE_UPLOADED,
        },
        result: {
          data: result,
        },
      });
    }
  }
);

module.exports = router;
