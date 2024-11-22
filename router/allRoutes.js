const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Register = require('../models/register');
const userController = require('../controllers/userController');
const { uploadImage } = require('../middleware/uploadImage');
const { ensureDoctorRole, ensureLaboratoryRole, ensureRadiologyRole, ensurePharmacyRole, ensureUserRole } = require('../middleware/roleMiddleware');


router.post('/reports/:id/report', async (req, res) => {
    try {
        const patient = await User.findById(req.params.id);
        if (patient) {
            patient.reports.push({
                report: req.body.report,
                rays: req.body.rays,
                analysis: req.body.analysis,
                Prescription: req.body.Prescription,
                doctorName: req.body.doctorName
            });
            await patient.save();
        }
        res.redirect('/');
    } catch (err) {
        console.log(err);
        res.status(500).send('An error occurred');
    }
});


// معالجة تسجيل الدخول
router.post('/login', userController.handleLogin);

// معالجة إنشاء الحساب
router.post('/signup', userController.handleSignup);

// تسجيل الخروج
router.get('/logout', userController.handleLogout);

// عرض صفحة تسجيل الدخول
router.get('/login', userController.login);

// عرض صفحة التسجيل
router.get('/signup', userController.signup);


// عرض الصفحة الرئيسية
router.get('/', userController.home);

// عرض صفحة الدكتور 
router.get('/doctor', ensureDoctorRole, userController.doctor);

// عرض صفحة المعمل
router.get('/laboratory', ensureLaboratoryRole, userController.laboratory);

// مسارات صفحة "radiology"
router.get('/radiology', ensureRadiologyRole, userController.radiology);

// مسارات صفحة "Pharmacy"
router.get('/pharmacy', ensurePharmacyRole, userController.pharmacy);

// مسارات صفحة "radiology"
router.get('/radiology', ensureRadiologyRole, userController.radiology);

// لوحة التحكم
router.get('/dashboard', userController.dashboard);


// إضافة مستخدم إلى قاعدة البيانات
router.post('/add', uploadImage, userController.addMongo);

// عرض صفحة إضافة مستخدم
router.get('/add', userController.add);



// عرض صفحة إضافة مستخدم
router.get('/add', userController.add);

// البحث وعرض نتائج البحث
router.post('/searchResult', userController.searchResult);
router.get('/searchResult', userController.searchResult);

// عرض بيانات المستخدم بناءً على ID
router.get('/user/:id', userController.view);

// حذف مستخدم من قاعدة البيانات
router.delete('/:id', userController.deleteUser);

module.exports = router;
