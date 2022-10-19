const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server error";

    // Mongodb error (CastError)
    if (err.name === "CastError") {
        const message = "Resource not valid : " + err.path;
        err = new ErrorHandler(message, 400);
    }

    // mongoose duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
        err = new ErrorHandler(message, 400)
    }

    // wrong jwt error
    if (err.name === "JsonWebTokenError") {
        const message = `Token is invalid, Try again`;
        err = new ErrorHandler(message, 400)
    }

    //JWT expire error
    if (err.name == "TokenExpiredError") {
        const message = `Token is expired, Try again`;
        err = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        err: err.stack
    })

    next()
}  