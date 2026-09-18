const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

// 1. Mongoose Schema define kar rahe hain
const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            trim: true,
            lowercase: true,
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: 6,
            select: false, // Security: Normal queries mein password database se uth kar API response me nahi aayega
        },
        phone: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'vendor', 'admin'],
            default: 'user',
        },
        resetPasswordToken: String,
        resetPasswordExpires: Date,
    },
    {
        timestamps: true, // Automatically `createdAt` aur `updatedAt` fields add kar dega
    }
);

// 2. Pre-save Hook: Password database mein save hone se thik pehle chalega
userSchema.pre('save', async function () {
    // Agar password field me koi change nahi hua hai (jaise user ne sirf naam badla), 
    // toh wapas hash mat karo, sidhe aage badh jao (next)
    if (!this.isModified('password')) {
        return;
    }

    // Bcrypt: Ek 'salt' generate karo (random string) aur password ko hash kar do
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// 3. Instance Method: Login ke time password match karne ke liye
userSchema.methods.matchPassword = async function (enteredPassword) {
    // bcrypt.compare() user ke daale hue plain password ko DB ke hashed password se match karta hai
    return await bcrypt.compare(enteredPassword, this.password);
};

// ==========================================
// 4. Generate & Hash Password Reset Token
// ==========================================
userSchema.methods.generateResetPasswordToken = function () {
    const rawToken = crypto.randomBytes(32).toString('hex');

    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');

    this.resetPasswordExpires = Date.now() + 60 * 60 * 1000;

    return rawToken;
};

// 5. Model ko export kar rahe hain taaki baaki controllers isko use kar sakein
const User = mongoose.model('User', userSchema);

module.exports = User;
