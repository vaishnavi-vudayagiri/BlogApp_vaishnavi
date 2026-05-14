import cloudinary from "./cloudinary.js";

export const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "BlogAppDB" },
      (err, result) => {
        if (err) {
          console.log("Cloudinary error:", err);
          return reject(err);
        }

        console.log("Cloudinary success:", result);
        resolve(result); // ✅ FIXED
      }
    );

    stream.end(buffer);
  });
};