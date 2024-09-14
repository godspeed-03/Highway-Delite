import { v2 as cloudinary } from 'cloudinary'; 
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const fileuploadcontroller = async (filepathname: string): Promise<any | null> => {
  try {
    if (!filepathname) return null;

    const response = await cloudinary.uploader.upload(filepathname, {
      resource_type: 'auto',
    });

    console.log('File uploaded successfully:', response.original_filename, response.url);

    fs.unlinkSync(filepathname);
    return response;
  } catch (err) {
    if (fs.existsSync(filepathname)) {
      fs.unlinkSync(filepathname);
    }
    console.error(`Unable to upload the file to Cloudinary: ${err}`);
    return null;
  }
};
