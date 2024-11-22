const ensureRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.session && req.session.role === requiredRole) {
            req.personalName = req.session.personalName; // إضافة اسم المستخدم إلى الطلب
            return next(); // السماح بالوصول إلى الصفحة المطلوبة
        } else {
            return res.redirect('/'); // توجيه المستخدم إلى الصفحة الرئيسية إذا لم يكن له الدور المطلوب
        }
    };
};

module.exports = {
    ensureDoctorRole: ensureRole('doctor'),
    ensureLaboratoryRole: ensureRole('Laboratory'),
    ensureRadiologyRole: ensureRole('radiology'),
    ensurePharmacyRole: ensureRole('Pharmacy'),
    ensureUserRole: ensureRole('users')
};
