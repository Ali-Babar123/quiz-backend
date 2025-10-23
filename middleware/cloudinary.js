const { v2: cloudinary } = require("cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

// ✅ Storage on Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "resumes", // Cloudinary folder name
    resource_type: "raw", // for PDF, DOC, DOCX
    public_id: (req, file) => file.fieldname + "-" + Date.now(),
  },
});


const musicStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "music_files",
    resource_type: "video", // for mp3, wav, etc.
    public_id: (req, file) =>
      `music-${Date.now()}-${file.originalname.split(".")[0]}`,
  },
});

const upload = multer({ storage });
const uploadMusic = multer({ storage: musicStorage });

module.exports = { cloudinary, upload, uploadMusic };
