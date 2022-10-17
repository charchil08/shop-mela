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