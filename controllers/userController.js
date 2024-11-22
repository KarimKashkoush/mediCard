const Register = require('../models/register');
const User = require('../models/User');
const moment = require('moment');
const qrcode = require('qrcode');



// تسجيل الدخول
const login = (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/'); // أو أي صفحة أخرى تريد التوجيه إليها
    }
    res.render("login");
};

// انشاء حساب
const signup = (req, res) => {
    if (req.session && req.session.userId) {
        return res.redirect('/'); // أو أي صفحة أخرى تريد التوجيه إليها
    }
    res.render("signup");
};

const home = (req, res) => {
    const isLoggedIn = req.session && req.session.userId ? true : false;
    const personalName = req.session.personalName; // الحصول على اسم المستخدم من الجلسة
    const role = req.session.role || '';

    res.render('home', { role, title: "الهوية الطبية", isLoggedIn, personalName });
};

// صفحة الدكتور
const doctor = (req, res) => {
    res.render("doctor");
}

const laboratory = (req, res) => {
    res.render("laboratory");
}

const radiology = (req, res) => {
    res.render("radiology");
}

const pharmacy = (req, res) => {
    res.render("pharmacy");
}

const users = (req, res) => {
    res.render("users");
}

// عرض صفحة البحث للدكتور
const searchResult = (req, res) => {
    User.find({ nationalityId: req.body.searchValue }) // افترضنا البحث باستخدام البريد الإلكتروني كمثال
        .then((data) => {
            const isLoggedIn = req.session && req.session.userId ? true : false;
            const role = req.session.role || '';
            const personalName = req.session.personalName; // الحصول على اسم المستخدم من الجلسة

            res.render('searchResult', { personalName, isLoggedIn, role, result: data, title: "البطاقة الصحية - الطبيب", moment: moment });
        })
        .catch((err) => { console.log(err); });
};

// لوحة التحكم
const dashboard = (req, res) => {
    User.find()
        .then((data) => { res.render('dashboard', { result: data, title: "لوحة التحكم", moment }); })
        .catch((err) => { console.log(err); });
};

// صفحة إضافة مستخدم
const add = (req, res) => {
    res.render('add');
};

// إضافة مستخدم إلى MongoDB
const addMongo = (req, res) => {
    User.findOne({ nationalityId: req.body.nationalityId })
        .then(existingUser => {
            if (existingUser) {
                res.send(`
                    <script>
                        alert('الرقم القومي موجود بالفعل. الرجاء استخدام رقم قومي آخر.');
                        window.history.back(); // العودة إلى الصفحة السابقة
                    </script>
                `);
            } else {
                let dataInBody = req.body;

                // إنشاء الرابط الكامل للصورة
                const imageLink = `${req.file ? req.file.filename : 'default.jpg'}`;

                // تعيين الرابط الكامل للصورة في البيانات
                dataInBody.image = imageLink;

                const data = new User(dataInBody);
                return data.save()
                    .then(() => {
                        res.send(`
                            <script>
                                alert('تم التسجيل بنجاح!');
                                setTimeout(function() {
                                    window.location.href = '/add'; // إعادة توجيه إلى الصفحة بعد التنبيه
                                }, 1000); // تأخير لمدة ثانية واحدة قبل إعادة التوجيه
                            </script>
                        `);
                    })
                    .catch(err => {
                        console.log(err);
                        res.status(500).send('حدث خطأ ما.');
                    });
            }
        })
        .catch(err => {
            console.log(err);
            res.status(500).send('حدث خطأ ما.');
        });
};



// عرض بيانات الشخص الواحد فقط
const view = (req, res) => {
    User.findById(req.params.id)
        .then((result) => {

            const userLink = `${req.protocol}://${req.get('host')}${req.originalUrl}`;

            qrcode.toDataURL(userLink, (err, url) => {
                if (err) {
                    console.log(err);
                    return res.send("Error occurred");
                }
                const role = req.session.role || '';
                // تمرير بيانات المستخدم وQR Code إلى القالب
                res.render('view', { object: result, qrCodeUrl: url, moment, role });
            });
        })
        .catch((err) => {
            console.log(err);
            res.send("Error occurred");
        });
};

// حذف شخص من قاعدة البيانات
const deleteUser = (req, res) => {
    User.findByIdAndDelete(req.params.id)
        .then(() => { res.redirect('/dashboard'); })
        .catch((err) => { console.log(err); });
};

// تسجيل الدخول ومعالجة تسجيل الدخول
const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Register.findOne({ email });

        if (user && password === user.password) {
            if (!req.session) {
                return res.status(500).send('Session is not initialized.');
            }

            // تخزين معلومات المستخدم في الجلسة
            req.session.userId = user._id;
            req.session.role = user.role;
            req.session.personalName = user.personalName; // تأكد من تخزين اسم المستخدم هنا

            switch (user.role) {
                case 'doctor':
                    res.redirect('/');
                    break;
                case 'laboratory':
                    res.redirect('/');
                    break;
                case 'pharmacy':
                    res.redirect('/');
                    break;
                case 'radiology':
                    res.redirect('/');
                    break;
                case 'users':
                    res.redirect('/');
                    break;
                default:
                    res.redirect('/'); // أو أي صفحة أخرى تريد التوجيه إليها
                    break;
            }
        } else {
            res.status(401).send('البريد الإلكتروني أو كلمة المرور غير صحيحة.');
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('حدث خطأ ما.');
    }
};


// إنشاء حساب ومعالجة إنشاء الحساب
const handleSignup = async (req, res) => {
    const { personalName, role, email, password } = req.body;

    try {
        const existingUser = await Register.findOne({ email });

        if (existingUser) {
            res.send(`
                <script>
                    alert('البريد الإلكتروني موجود بالفعل. الرجاء استخدام بريد إلكتروني آخر.');
                    window.history.back(); // العودة إلى الصفحة السابقة
                </script>
            `);
        } else {
            // تشفير كلمة المرور قبل حفظها

            const newUser = new Register({ personalName, role, email, password });
            await newUser.save();
            res.redirect('/');
        }
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).send('حدث خطأ ما.');
    }
};

// تسجيل الخروج ومعالجة تسجيل الخروج
const handleLogout = (req, res) => {
    // التحقق من وجود الجلسة أولاً
    if (req.session) {
        // تدمير الجلسة
        req.session.destroy((err) => {
            if (err) {
                console.error('Error during logout:', err);
                return res.status(500).send('حدث خطأ أثناء تسجيل الخروج. يرجى المحاولة مرة أخرى.');
            }

            // إعادة التوجيه إلى صفحة تسجيل الدخول بعد تسجيل الخروج
            res.redirect('/');
        });
    } else {
        // إذا لم تكن هناك جلسة موجودة، إعادة التوجيه إلى صفحة تسجيل الدخول
        res.redirect('/');
    }
};


module.exports = { home, addMongo, add, view, deleteUser, dashboard, searchResult, doctor, laboratory, radiology, pharmacy, users, login, signup, handleLogin, handleSignup, handleLogout };
