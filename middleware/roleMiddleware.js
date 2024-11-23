const ensureRole = (requiredRole) => {
    return (req, res, next) => {
        if (req.session && req.session.role === requiredRole) {
            req.personalName = req.session.personalName;
            return next();
        } else {
            return res.redirect('/');
        }
    };
};

module.exports = {
    ensureDoctorRole: ensureRole('doctor'),
    ensureLaboratoryRole: ensureRole('Laboratory'),
    ensureRadiologyRole: ensureRole('radiology'),
    ensurePharmacyRole: ensureRole('Pharmacy'),
    ensureUserRole: ensureRole('users'),
    ensureDashboardRole: ensureRole('dashboard')
};
