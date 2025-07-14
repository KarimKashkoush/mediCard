const express = require('express');
const router = express.Router();
const User = require('../models/User');
const userController = require('../controllers/userController');
const { uploadImage } = require('../middleware/uploadImage');
const { ensureDoctorRole, ensureLaboratoryRole, ensureRadiologyRole, ensurePharmacyRole } = require('../middleware/roleMiddleware');






// router
router.post('/bulk-insert', userController.bulkInsertUsers);

router.post('/api/users', userController.addMultipleUsers);

router.get('/api/dashboard', userController.getDashboardData);

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

const { uploadAnalysisResult } = require('../middleware/analysisResults');
router.post('/add-analysis-results/:reportId', uploadAnalysisResult, async (req, res) => {
    const reportId = req.params.reportId; // استخراج الـ reportId من الرابط
    const uploadedFiles = req.files.map(file => file.filename); // أسماء الملفات المرفوعة

    try {
        // تحديث التقرير المرتبط
        const updatedUser = await User.findOneAndUpdate(
            { "reports._id": reportId }, // البحث عن التقرير باستخدام _id
            { $push: { "reports.$.analysisResults": { $each: uploadedFiles } } }, // إضافة الصور إلى analysisResults
            { new: true } // إعادة النتيجة بعد التحديث
        );

        if (!updatedUser) {
            return res.status(404).send(`
                <script>
                    alert('التقرير غير موجود.');
                    window.history.back();
                    </script>
                    `);
        }

        // إعادة التوجيه إلى صفحة المستخدم مع إضافة رسالة النجاح في الـ query
        res.send(`
                    <script>
                    alert('تم إضافة نتائج التحاليل بنجاح.');
                    window.location.href = '/user/${updatedUser._id}?success=تم إضافة نتائج التحاليل بنجاح'; // إعادة التوجيه إلى صفحة المستخدم
                    </script>
                    `);

    } catch (err) {
        console.error(err);
        res.status(500).send(`
            <script>
            alert('حدث خطأ أثناء إضافة الصور.');
            window.history.back();
            </script>
            `);
    }
});

const { uploadRadiologyResult } = require('../middleware/radiologyResults');
router.post('/add-radiology-results/:reportId', uploadRadiologyResult, async (req, res) => {
    const reportId = req.params.reportId; // استخراج الـ reportId من الرابط
    const uploadedFiles = req.files.map(file => file.filename); // أسماء الملفات المرفوعة

    try {
        // تحديث التقرير المرتبط
        const updatedUser = await User.findOneAndUpdate(
            { "reports._id": reportId }, // البحث عن التقرير باستخدام _id
            { $push: { "reports.$.radiologyResults": { $each: uploadedFiles } } }, // إضافة الصور إلى radiologyResults
            { new: true } // إعادة النتيجة بعد التحديث
        );

        if (!updatedUser) {
            return res.status(404).send(`
                <script>
                    alert(' غير موجود.');
                    window.history.back();
                </script>التقرير
            `);
        }

        // إعادة التوجيه إلى صفحة المستخدم مع إضافة رسالة النجاح في الـ query
        res.send(`
            <script>
                alert('تم إضافة نتائج الآشعة بنجاح.');
                window.location.href = '/user/${updatedUser._id}?success=تم إضافة نتائج التحاليل بنجاح'; // إعادة التوجيه إلى صفحة المستخدم
            </script>
        `);

    } catch (err) {
        console.error(err);
        res.status(500).send(`
            <script>
                alert('حدث خطأ أثناء إضافة نتائج الآشعة.');
                window.history.back();
            </script>
        `);
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
