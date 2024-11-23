const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema للتقارير
const reportsSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }, // لكل تقرير معرف فريد
    report: String,
    rays: String,
    analysis: String,
    analysisResults: [String], // لتخزين أسماء صور التحاليل
    radiologyResults: [String],
    Prescription: String,
    doctorName: String
}, { timestamps: true });

// Schema المستخدم
const userSchema = new Schema({
    fullName: String,
    nationalityId: Number,
    birthday: String,
    tele: Number,
    image: String,
    emergencyNumber1: Number,
    emergencyNumber2: Number,
    Country: String,
    email: String,
    job: String,
    blood: String,
    healthy: String,
    reports: [reportsSchema], // مجموعة التقارير
}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;
