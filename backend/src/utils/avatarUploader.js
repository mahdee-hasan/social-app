import axios from "axios";
import cloudinary from "../config/cloudinaryConfig.js";

async function uploadGoogleAvatarToCloudinary(googlePhotoUrl, userId) {
  // Download image from Google
  const response = await axios.get(googlePhotoUrl, {
    responseType: "arraybuffer",
  });

  const base64Image = Buffer.from(response.data, "binary").toString("base64");

  // Upload to Cloudinary
  const upload = await cloudinary.uploader.upload(
    `data:image/jpeg;base64,${base64Image}`,
    {
      folder: "avatars",
      public_id: `avatar_${userId}`,
      overwrite: true,
    }
  );

  return upload.secure_url;
}

export default uploadGoogleAvatarToCloudinary;
