import cloudinary from "../config/cloudinary.config.js";
import streamifier from "streamifier";

const uploadFileToCloudinary = async (
  buffer,
  folder,
  resource_type = "auto",
  originalName
) => {
  try {
    const extension = originalName?.split(".").pop(); // 'pdf', 'jpg'
    const uniqueName = `${Date.now()}_${Math.random()
      .toString(36)
      .substring(7)}.${extension}`;

    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { public_id: uniqueName, folder, resource_type },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      streamifier.createReadStream(buffer).pipe(stream);
    });

    return {
      secure_url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (err) {
    console.error("Error in file upload ", err);
    return false;
  }
};

const deleteCloudinaryFile = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    console.log('Deleted:', result);
    return result;
  } catch (error) {
    console.error('Cloudinary deletion failed:', error);
    throw error;
  }
};


export default {
  uploadFileToCloudinary,
  deleteCloudinaryFile
};
