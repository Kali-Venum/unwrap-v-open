const S3 = require("aws-sdk/clients/s3");
const config = require("../configs/index");
const fs = require("fs");

const s3 = new S3({
  region: config.aws.s3.bucketRegion,
  accessKeyId: config.aws.s3.accessKeyId,
  secretAccessKey: config.aws.s3.secretKey,
});

// Upload a file to s3.
function uploadFileToS3(file, uploadFolderName) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: config.aws.s3.bucketName,
    Body: fileStream,
    Key: `${uploadFolderName} ${file.filename}.jpg`,
  };

  return s3.upload(uploadParams).promise();
}

module.exports = {
  uploadFileToS3,
};
