const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    personalName: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String
    }
});

const Register = mongoose.model('Register', userSchema);

module.exports = Register;
