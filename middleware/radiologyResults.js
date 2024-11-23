const fs = require('fs');
const path = require('path');
const multer = require('multer');

// تحديد المسار الكامل للمجلد
const directoryPath = path.join(__dirname, 'public/results');

// تحقق من وجود المجلد وإنشائه إذا لم يكن موجودًا
if (!fs.existsSync(directoryPath)) {
      fs.mkdirSync(directoryPath, { recursive: true }); // إنشاء المجلد إذا لم يكن موجودًا
}

// إعداد تخزين الملفات
const storage = multer.diskStorage({
      destination: (req, file, cb) => {
            cb(null, 'public/results'); // مسار الملفات المرفوعة
      },
      filename: (req, file, cb) => {
            cb(null, `${Date.now()}-${file.originalname}`); // اسم الملف الفريد
      }
});

// تصفية الملفات: السماح بالصور فقط
const fileFilter = (req, file, cb) => {
      if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
            cb(null, true); // السماح برفع الصور فقط
      } else {
            cb(new Error('الملفات المرفوعة يجب أن تكون صور فقط!'), false);
      }
};

// إعداد multer
const upload = multer({
      storage: storage,
      fileFilter: fileFilter
});

// دعم رفع ملفات متعددة (بحد أقصى 5 صور)
const uploadRadiologyResult = upload.array('radiologyResults', 10);

module.exports = { uploadRadiologyResult };
