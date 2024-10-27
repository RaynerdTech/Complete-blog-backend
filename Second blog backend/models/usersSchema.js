const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: function() { return !this.credentialAccount; }, // Password required if not using credential account
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    credentialAccount: {
        type: Boolean,
        default: false
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: function() { return !this.credentialAccount; }, // Gender required if not using credential account
    },
    age: {
        type: Number,
        required: function() { return !this.credentialAccount; }, // Age required if not using credential account
    },
    role: {
        type: String,
        enum: ['User', 'Admin', 'SuperAdmin'],
        default: 'User'
    }
}, { timestamps: true });

userSchema.index({ createdAt: -1 });

const userModel = mongoose.model('User', userSchema);
module.exports = userModel;
