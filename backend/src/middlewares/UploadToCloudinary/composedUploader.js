import { upload } from "./uploader.js";
import { cloudinaryUpload } from "./cloudinaryUpload.js";

// For single file
const singleUploader = (folder) => [
  upload.single("file"),
  cloudinaryUpload(folder),
];

// For multiple files
const multipleUploader = (folder, maxCount = 5) => [
  upload.array("files", maxCount),
  cloudinaryUpload(folder),
];

export { multipleUploader, singleUploader };
