require('dotenv/config')
const http = require("http");
const path = require("path");

const aws = require("aws-sdk")
const multerS3 = require("multer-s3")
const multer = require("multer");

const cors = require('cors')
const { v4: uuidv4 } = require('uuid');
const express = require("express");
const app = express();
app.use(cors())
const httpServer = http.createServer(app);
const PORT = process.env.PORT || 4201;

aws.config.update({
  secretAccessKey: process.env.SECRET_KEY,
  accessKeyId: process.env.ACCESS_KEY,
  region: 'eu-central-1'
});

const s3 = new aws.S3({ apiVersion: '2006-03-01' });

httpServer.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'image-uploader-storage',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      var fileExtension = file.originalname.split(".")[1];
      var path = "uploads/" + uuidv4() + Date.now() + "." + fileExtension;
      cb(null, path); 
  }
  })
})

app.post(
    "/upload",
    upload.single("file" /* name attribute of <file> element in your form */),
    (req, res) => {
          res
            .status(200)
            .contentType("application/json")
            .json({path:req.file.location})
            .end()
        })