const User = require("../models/user");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncHandler = require("../middleware/catchAsyncError");
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