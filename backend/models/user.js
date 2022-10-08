const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const crypto = require("crypto")


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please provide name"],
        maxLength: [30, "Please enter short name"],
        minLength: [4, "Please provide full name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Please provide email"],
        unique: true,
        validate: [validator.isEmail, "Please provide valid email"]
    },
    password: {
        type: String,
        required: [true, "Please provide password"],
        minLength: [8, "Minimum 8 characters"],
        select: false,
    },
    avatar: {
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    const saltRound = 10;
    this.password = await bcrypt.hash(this.password, saltRound);
})

userSchema.methods = {
    getJWTToken: function () {
        return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRE
        })
    },

    comparePassword: async function (password) {
        const isPasswordMatched = await bcrypt.compare(password, this.password);
        console.log(isPasswordMatched);
        return isPasswordMatched;
    },

    getResetPasswordToken: function () {
        const resetToken = crypto.randomBytes(20)
    }

}


module.exports = mongoose.model("User", userSchema);