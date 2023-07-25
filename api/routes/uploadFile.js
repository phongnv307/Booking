import express from 'express';
import multer from 'multer';
import { uploadFile } from '../controllers/uploadFile.js';

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads"); // Thư mục để lưu trữ ảnh
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname); // Đổi tên file để tránh bị trùng lặp
    },
});
const upload = multer({ storage });

router.post('/', upload.single('image'), uploadFile);

export default router;