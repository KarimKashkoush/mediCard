const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const reportsSchema = new Schema({
    report: String,
    rays: String,
    analysis: String,
    analysisImage: String,
    Prescription: String,
    doctorName: String
},
    { timestamps: true }, { _id: false });


const articleSchema = new Schema({
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
    reports: [reportsSchema],
},
    { timestamps: true }
)

// Create a model based on that schema
const User = mongoose.model("User", articleSchema);

// export the model
module.exports = User;