import * as cloudinary from 'cloudinary';
import * as fs from 'fs';
import * as path from 'path';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: string) => {
  try {
    if (!localFilePath) return null;
    console.log('Uploading to Cloudinary:', localFilePath);

    const currentTime = new Date();
    console.log('Current server time:', currentTime.toISOString());

    const response = await cloudinary.v2.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    console.log('File uploaded to Cloudinary:', response);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Remove the local file after successful upload
    }

    return response;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);

    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath); // Remove the local file even if upload failed
    }

    return null;
  }
};
