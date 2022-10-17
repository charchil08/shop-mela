const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncHandler = require("../middleware/catchAsyncError");
const { sendEmail } = require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");

exports.registerUser = catchAsyncHandler(async (req, res, next) => {
    const { name, email, password } = req.body;

    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            public_id: "This is same id",
            url: "This is sample url",
        }
    })

    await sendToken(user, 201, res);
})


exports.loginUser = catchAsyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    // checking if user has given email & password
    if (!email || !password) {
        next(new ErrorHandler("Please enter Email and password"), 400)
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
        return next(new ErrorHandler("Invalid Email or password", 401))
    }

    const isPasswordMatched = await user.comparePassword(password);

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid Email or password", 401))
    }

    await sendToken(user, 200, res);
})


exports.logout = catchAsyncHandler(async (req, res, next) => {

    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
    });

    res.status(200).json({
        success: true,
        message: "Logged out"
    })

})

// Forgot password
exports.forgotPassword = catchAsyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    // console.log(user);

    if (!user) {
        return next(new ErrorHandler("User not found"), 404);
    }

    // get ResetPassword Token
    const resetToken = await user.getResetPasswordToken();
    // console.log(resetToken)

    await user.save({ validateBeforeSave: false });

    const resetPasswordUrl = `${req.protocol}://${req.get("host")}/api/v1/password/${resetToken}`;

    const message = `Hello ${user.name}, \n
    Your reset password link is : \n\n
    ${resetPasswordUrl} 
    \n\n
    
    If you have not requested this link, please ignore it.
    `

    // console.log(message)
    try {
        await sendEmail({
            email: user.email,
            subject: `Ecommerce password recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `email sent to ${user.email} successfully.`
        })
    }
    catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false })

        return next(new ErrorHandler(error.message), 500);
    }

})

// Get user detail
exports.getUserDetails = catchAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    })
})


// update a password
exports.updatePassword = catchAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id).select('+password');

    const isPasswordMatched = await user.comparePassword(req.body.oldPassword)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Old password is incorrect", 400))
    }

    if (req.body.newPassword !== req.body.confirmPassword) {
        return next(new ErrorHandler("password does not match"), 400)
    }

    user.password = req.body.newPassword;
    await user.save();
    await sendToken(user, 200, res);

})

// update user profile
exports.updateProfile = catchAsyncHandler(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        // TODO:we will add cloudinary later for avatar
    }

    const user = await User.findByIdAndUpdate(req.user._id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        user
    })
})




// Get all users -- admin
exports.getAllUsers = catchAsyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    })
})


// Get single user -- admin search by admin from params
exports.getSingleUser = catchAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`), 400);
    }
    res.status(200).json({
        success: true,
        user
    })
})

// update user role -- Admin
exports.updateUserRole = catchAsyncHandler(async (req, res, next) => {
    const newUserData = {
        //     name: req.body.name,
        //     email: req.body.email,
        role: req.body.role
    }
    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    if (!user) {
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`), 400);
    }
    res.status(200).json({
        success: true,
        user
    })
})

// Delete user
exports.deleteUser = catchAsyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    // TODO: we will remove cloudinary later
    if (!user) {
        return next(new ErrorHandler(`User does not exist with id : ${req.params.id}`), 400);
    }
    await user.remove();
    res.status(200).json({
        success: true,
        message: `User deleted successfully by ${req.user.name}`
    })
})