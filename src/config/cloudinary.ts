import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import config from "../config";

cloudinary.config({
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
});

export const sendImageToCloudinary = (
  imageName: string,
  buffer: Buffer
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        public_id: imageName.trim(),
        folder: "products", 
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result as UploadApiResponse);
      }
    );

    uploadStream.end(buffer);
  });
};

export default cloudinary;